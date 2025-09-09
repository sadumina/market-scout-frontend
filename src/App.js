import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

// Expanded product list based on Haycarb portfolio
const PRODUCTS = [
  "PFAS",
  "Soil Remediation",
  "Mining",
  "Gold Recovery",
  "Drinking Water",
  "Wastewater Treatment",
  "Air & Gas Purification",
  "Mercury Removal",
  "Food & Beverage",
  "Energy Storage",
  "Catalyst Support",
  "Automotive Filters",
  "Medical & Pharma",
  "Nuclear Applications"
];

function App() {
  const [opportunities, setOpportunities] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("PFAS");
  const [loading, setLoading] = useState(false);

  // Fetch opportunities from backend
  const fetchData = async (product = "PFAS") => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8000/opportunities?product=${encodeURIComponent(product)}`
      );
      setOpportunities(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Error fetching opportunities:", err);
      // Set empty arrays on error
      setOpportunities([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedProduct);
  }, [selectedProduct]);

  // Apply day/month/year filters
  const applyFilter = (type) => {
    setFilterType(type);
    const now = new Date();

    if (type === "day") {
      const today = now.toISOString().slice(0, 10);
      setFiltered(opportunities.filter((opp) => opp.date?.slice(0, 10) === today));
    } else if (type === "month") {
      const ym = now.toISOString().slice(0, 7);
      setFiltered(opportunities.filter((opp) => opp.date?.slice(0, 7) === ym));
    } else if (type === "year") {
      const year = now.getFullYear().toString();
      setFiltered(opportunities.filter((opp) => opp.date?.startsWith(year)));
    } else {
      setFiltered(opportunities);
    }
  };

  // Enhanced date formatting
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // Get filter display text
  const getFilterDisplayText = () => {
    switch (filterType) {
      case "day": return "Today";
      case "month": return "This Month";
      case "year": return "This Year";
      default: return "All Time";
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>AI Market Scout Dashboard</h1>
        <p>Stay ahead with real-time environmental & market intelligence</p>

        {/* Product Dropdown */}
        <div className="product-filter">
          <label htmlFor="product" className="dropdown-label">Select Product:</label>
          <select
            id="product"
            className="dropdown"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            {PRODUCTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Time Filters */}
        <div className="filter-buttons">
          <button
            className={filterType === "all" ? "active" : ""}
            onClick={() => applyFilter("all")}
          >
            🌎 All
          </button>
          <button
            className={filterType === "day" ? "active" : ""}
            onClick={() => applyFilter("day")}
          >
            📅 Today
          </button>
          <button
            className={filterType === "month" ? "active" : ""}
            onClick={() => applyFilter("month")}
          >
            🗓️ This Month
          </button>
          <button
            className={filterType === "year" ? "active" : ""}
            onClick={() => applyFilter("year")}
          >
            📆 This Year
          </button>
        </div>

        {/* Refresh Button */}
        <button 
          className="refresh-btn" 
          onClick={() => fetchData(selectedProduct)}
          disabled={loading}
        >
          🔄 {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <main className="main-content">
        {loading ? (
          <div className="loading">
            <div>⏳ Loading latest {selectedProduct} opportunities...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div>
              <h3>No opportunities found</h3>
              <p>No opportunities found for <strong>{selectedProduct}</strong> ({getFilterDisplayText()}).</p>
              <p>Try adjusting your search criteria or check back later.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              background: 'white',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <strong>{filtered.length}</strong> opportunities found for <strong>{selectedProduct}</strong>
              </div>
              <div style={{ 
                fontSize: '0.875rem', 
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--success)',
                  animation: 'pulse 2s infinite'
                }}></span>
                Filter: {getFilterDisplayText()}
              </div>
            </div>

            {/* Cards Grid */}
            <div className="card-grid">
              {filtered.map((opp, index) => (
                <div key={opp.id} className="card">
                  <h2>{opp.title}</h2>
                  <div className="meta">
                    <strong>Source:</strong> {opp.source} <br />
                    <strong>Date:</strong> {formatDate(opp.date)}
                  </div>
                  <p className="summary">{opp.summary}</p>
                  <a
                    href={opp.link}
                    target="_blank"
                    rel="noreferrer"
                    className="read-more"
                  >
                    🔗 Read Full Article
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;