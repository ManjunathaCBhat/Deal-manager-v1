import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { FaSearch, FaBullseye, FaDollarSign } from 'react-icons/fa';
import DealAssistant from '../components/DealAssistant';
import AddDealModal from "../components/AddDealModal";
import { useNavigate } from "react-router-dom";



const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeStage, setActiveStage] = useState("all");
  const navigate = useNavigate();


  // ---- Fetch deals from backend ----
  const fetchDeals = async () => {
    try {
      const res = await api.get('/api/deals/');
      setDeals(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch deals.");
    } finally {
      setLoading(false);
    }
  };

const [showAddModal, setShowAddModal] = useState(false);


  useEffect(() => {
    fetchDeals();
  }, []);

  // ---- Filter by stage ----
  const filterByStage = (deal) => {
    if (activeStage === "all") return true;
    return deal.stage.toLowerCase() === activeStage.toLowerCase();
  };

  // ---- Stats ----
  const totalDeals = deals.length;
  const totalValue = deals.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
  const activeDeals = deals.filter(d => d.stage !== "closed").length;

  return (
    <div className="p-6 w-full">

      {/* PAGE TITLE + CTA */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-500 mt-1">Track and manage your sales opportunities</p>
        </div>

        <div className="flex gap-3">
          <button onClick={() => navigate('/pipeline')} className="px-4 py-2 border rounded-lg flex items-center gap-2">
            <FaBullseye /> View Pipeline
          </button>

          <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
            + Add Deal
        </button>

        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaBullseye className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Deals</p>
              <p className="text-2xl font-bold text-gray-900">{totalDeals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaDollarSign className="text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <FaBullseye className="text-orange-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Active Deals</p>
              <p className="text-2xl font-bold text-gray-900">{activeDeals}</p>
            </div>
          </div>
        </div>

      </div>

{/* SEARCH + STAGE DROPDOWN */}
<div className="bg-white p-4 rounded-xl shadow-sm mb-8">
  <div className="flex gap-4 items-center">

    {/* Search Bar */}
    <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg flex-1">
      <FaSearch className="text-gray-400" />
      <input
        type="text"
        placeholder="Search deals..."
        className="bg-transparent outline-none flex-1"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    {/* Stage Filter Dropdown */}
    <select
      value={activeStage}
      onChange={(e) => setActiveStage(e.target.value)}
      className="px-4 py-2 border rounded-lg bg-white cursor-pointer text-gray-700"
    >
      <option value="all">All Stages</option>
      <option value="prospecting">Prospecting</option>
      <option value="qualification">Qualification</option>
      <option value="proposal">Proposal</option>
    </select>

  </div>
</div>


      {/* TABLE + AI SIDEBAR */}
      <div className="grid grid-cols-3 gap-6">

        {/* LEFT - TABLE */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Deals ({totalDeals})</h2>

          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm">
                <th className="pb-3">Deal Name</th>
                <th className="pb-3">Company</th>
                <th className="pb-3">Value</th>
                <th className="pb-3">Stage</th>
                <th className="pb-3">Close Date</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan="5">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan="5">{error}</td></tr>
              ) : deals.length === 0 ? (
                <tr><td colSpan="5">No deals found.</td></tr>
              ) : (
                deals
                  .filter(deal => deal.title.toLowerCase().includes(search.toLowerCase()))
                  .filter(filterByStage)
                  .map(deal => (
                    <tr key={deal.id} className="border-t">
                      <td className="py-3">
                        <Link to={`/deal-details/${deal.id}`} className="text-blue-600 font-medium">
                          {deal.title}
                        </Link>
                      </td>
                      <td>{deal.company_name}</td>
                      <td>${parseFloat(deal.amount).toLocaleString()}</td>
                      <td>{deal.stage}</td>
                      <td>{deal.close_date}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* RIGHT - AI ASSISTANT */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <DealAssistant />
        </div>

      </div>

{showAddModal && (
  <AddDealModal
    onClose={() => setShowAddModal(false)}
    onSuccess={() => {
      setShowAddModal(false);
      fetchDeals(); // refresh table
    }}
  />
)}

    </div>
    
  );
};

export default DealsPage;
