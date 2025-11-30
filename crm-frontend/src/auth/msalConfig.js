import { PublicClientApplication, LogLevel } from "@azure/msal-browser";

/**
 * MSAL Configuration for Azure AD SSO
 * 
 * To enable Azure SSO:
 * 1. Register your app in Azure Portal (Azure Active Directory > App registrations)
 * 2. Configure redirect URIs (e.g., http://localhost:3000)
 * 3. Set the environment variables below
 */

// Get config from environment or use defaults for development
const AZURE_CLIENT_ID = process.env.REACT_APP_AZURE_CLIENT_ID || "";
const AZURE_TENANT_ID = process.env.REACT_APP_AZURE_TENANT_ID || "";
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI || window.location.origin;

// Check if Azure SSO is configured
export const isAzureSSOConfigured = () => {
  return Boolean(AZURE_CLIENT_ID && AZURE_TENANT_ID);
};

// MSAL configuration
export const msalConfig = {
  auth: {
    clientId: AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${AZURE_TENANT_ID}`,
    redirectUri: REDIRECT_URI,
    postLogoutRedirectUri: REDIRECT_URI,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
          case LogLevel.Info:
            // console.info(message);
            break;
          case LogLevel.Verbose:
            // console.debug(message);
            break;
          default:
            break;
        }
      },
      logLevel: LogLevel.Warning,
    },
  },
};

// Scopes for login request
export const loginRequest = {
  scopes: ["User.Read", "openid", "profile", "email"],
};

// Silent login request (for auto-login)
export const silentRequest = {
  scopes: ["User.Read", "openid", "profile", "email"],
};

// Scopes for API access (if needed)
export const apiRequest = {
  scopes: [`api://${AZURE_CLIENT_ID}/access_as_user`],
};

// Initialize MSAL instance
let msalInstance = null;
let msalInitialized = false;

export const getMsalInstance = () => {
  if (!msalInstance && isAzureSSOConfigured()) {
    msalInstance = new PublicClientApplication(msalConfig);
  }
  return msalInstance;
};

// Check if MSAL is initialized
export const isMsalInitialized = () => msalInitialized;

// Initialize MSAL on app load
export const initializeMsal = async () => {
  if (msalInitialized) {
    return msalInstance;
  }
  
  const instance = getMsalInstance();
  if (instance) {
    try {
      await instance.initialize();
      msalInitialized = true;
      // Handle redirect promise (for redirect login flow)
      await instance.handleRedirectPromise();
    } catch (err) {
      console.error("Failed to initialize MSAL:", err);
    }
  }
  return instance;
};
