import { useState, useCallback, useEffect } from "react";
import { getMsalInstance, loginRequest, silentRequest, isAzureSSOConfigured, initializeMsal, isMsalInitialized } from "./msalConfig";
import api from "../api/axios";

/**
 * Custom hook for Azure AD SSO authentication
 * Handles Microsoft login and token exchange with backend
 */
export const useAzureAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(isMsalInitialized());

  // Initialize MSAL on hook mount
  useEffect(() => {
    const init = async () => {
      if (isAzureSSOConfigured() && !isMsalInitialized()) {
        await initializeMsal();
        setInitialized(true);
      }
    };
    init();
  }, []);

  /**
   * Initiate Microsoft SSO login
   * Uses popup flow for better UX
   */
  const loginWithMicrosoft = useCallback(async () => {
    if (!isAzureSSOConfigured()) {
      setError("Azure SSO is not configured. Please set REACT_APP_AZURE_CLIENT_ID and REACT_APP_AZURE_TENANT_ID.");
      return { success: false, error: "SSO not configured" };
    }

    setLoading(true);
    setError(null);

    try {
      // Ensure MSAL is initialized
      if (!isMsalInitialized()) {
        await initializeMsal();
      }

      const msalInstance = getMsalInstance();
      
      if (!msalInstance) {
        throw new Error("MSAL not initialized");
      }

      let loginResponse;
      
      // Check if user already has an active account (for seamless SSO)
      const accounts = msalInstance.getAllAccounts();
      
      if (accounts.length > 0) {
        // User has logged in before - try silent token acquisition
        try {
          loginResponse = await msalInstance.acquireTokenSilent({
            ...silentRequest,
            account: accounts[0],
          });
        } catch (silentError) {
          // Silent login failed, fall back to popup
          console.log("Silent login failed, using popup");
          loginResponse = await msalInstance.loginPopup(loginRequest);
        }
      } else {
        // No cached account - show popup (required for first login)
        // Force fresh login to get proper ID token
        loginResponse = await msalInstance.loginPopup({
          ...loginRequest,
          prompt: "select_account",
        });
      }
      
      if (!loginResponse || (!loginResponse.accessToken && !loginResponse.idToken)) {
        throw new Error("No token received from Microsoft");
      }

      console.log("Azure login successful, exchanging token with backend...");
      console.log("Account:", loginResponse.account?.username);

      // Use accessToken for Graph API validation
      const tokenToSend = loginResponse.accessToken || loginResponse.idToken;
      
      console.log("Token type being sent:", loginResponse.accessToken ? "accessToken" : "idToken");

      // Exchange Azure token for our app's JWT
      // Use fetch directly to avoid axios interceptor adding old tokens
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/auth/azure/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: tokenToSend }),
      });
      
      const data = await response.json();
      
      console.log("Backend token exchange response:", response.status);

      if (response.ok && data.access_token) {
        // Store our app's token
        localStorage.setItem("access_token", data.access_token);
        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
        }
        
        // Store Azure account info for later (e.g., for logout)
        localStorage.setItem("azure_account", JSON.stringify({
          username: loginResponse.account?.username,
          name: loginResponse.account?.name,
          homeAccountId: loginResponse.account?.homeAccountId,
        }));

        setLoading(false);
        return { success: true, user: loginResponse.account };
      } else {
        throw new Error(data.detail || "Failed to exchange token with backend");
      }

    } catch (err) {
      console.error("Azure SSO Error:", err);
      
      // Check for user cancellation or popup blocked errors
      const errorCode = err.errorCode || "";
      const errorMessage = err.message || "";
      
      // User cancelled the popup or popup was blocked
      if (errorCode === "user_cancelled" || 
          errorCode === "popup_window_error" ||
          errorMessage.includes("user_cancelled") ||
          errorMessage.includes("popup") ||
          errorMessage.includes("cancelled")) {
        setLoading(false);
        return { success: false, error: "user_cancelled" };
      }
      
      const displayError = err.response?.data?.detail || err.message || "Microsoft sign-in failed";
      setError(displayError);
      setLoading(false);
      return { success: false, error: displayError };
    }
  }, []);

  /**
   * Alternative: Login with redirect (full page redirect to Microsoft)
   * Use this if popups are blocked
   */
  const loginWithMicrosoftRedirect = useCallback(async () => {
    if (!isAzureSSOConfigured()) {
      setError("Azure SSO is not configured");
      return;
    }

    try {
      // Ensure MSAL is initialized
      if (!isMsalInitialized()) {
        await initializeMsal();
      }

      const msalInstance = getMsalInstance();
      if (msalInstance) {
        await msalInstance.loginRedirect(loginRequest);
      }
    } catch (err) {
      console.error("Azure redirect login error:", err);
      setError(err.message);
    }
  }, []);

  /**
   * Handle redirect response after Microsoft login redirect
   * Call this on app initialization
   */
  const handleRedirectResponse = useCallback(async () => {
    if (!isAzureSSOConfigured()) {
      return null;
    }

    try {
      // Ensure MSAL is initialized
      if (!isMsalInitialized()) {
        await initializeMsal();
      }

      const msalInstance = getMsalInstance();
      if (!msalInstance) return null;

      const response = await msalInstance.handleRedirectPromise();
      
      if (response && response.idToken) {
        // Exchange Azure ID token for our app's JWT
        const apiResponse = await api.post("/api/auth/azure/token", {
          access_token: response.idToken,
        });

        if (apiResponse.data && apiResponse.data.access_token) {
          localStorage.setItem("access_token", apiResponse.data.access_token);
          if (apiResponse.data.refresh_token) {
            localStorage.setItem("refresh_token", apiResponse.data.refresh_token);
          }
          return { success: true, user: response.account };
        }
      }
      
      return null;
    } catch (err) {
      console.error("Error handling redirect:", err);
      return null;
    }
  }, []);

  /**
   * Logout from both our app and Microsoft
   */
  const logout = useCallback(async () => {
    // Clear our tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    
    // Get stored Azure account for logout
    const azureAccountStr = localStorage.getItem("azure_account");
    localStorage.removeItem("azure_account");

    if (!isAzureSSOConfigured()) {
      return;
    }

    try {
      // Ensure MSAL is initialized
      if (!isMsalInitialized()) {
        await initializeMsal();
      }

      const msalInstance = getMsalInstance();
      if (msalInstance && azureAccountStr) {
        const azureAccount = JSON.parse(azureAccountStr);
        const account = msalInstance.getAccountByHomeId(azureAccount.homeAccountId);
        
        if (account) {
          // Logout from Microsoft (optional - can use logoutPopup or logoutRedirect)
          await msalInstance.logoutPopup({
            account: account,
            postLogoutRedirectUri: window.location.origin + "/login",
          });
        }
      }
    } catch (err) {
      console.error("Error during Microsoft logout:", err);
    }
  }, []);

  /**
   * Get current Azure account (if logged in via SSO)
   */
  const getAzureAccount = useCallback(() => {
    const accountStr = localStorage.getItem("azure_account");
    if (accountStr) {
      try {
        return JSON.parse(accountStr);
      } catch {
        return null;
      }
    }
    return null;
  }, []);

  /**
   * Check if user is authenticated via Azure SSO
   */
  const isAzureAuthenticated = useCallback(() => {
    return Boolean(localStorage.getItem("azure_account"));
  }, []);

  return {
    loginWithMicrosoft,
    loginWithMicrosoftRedirect,
    handleRedirectResponse,
    logout,
    getAzureAccount,
    isAzureAuthenticated,
    isAzureSSOConfigured: isAzureSSOConfigured(),
    initialized,
    loading,
    error,
    clearError: () => setError(null),
  };
};

export default useAzureAuth;
