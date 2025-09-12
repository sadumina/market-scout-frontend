import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const PRODUCTS = [
  { name: "PFAS" },
  { name: "Soil Remediation" },
  { name: "Mining" },
  { name: "Gold Recovery" },
  { name: "Drinking Water" },
  { name: "Wastewater Treatment" },
  { name: "Air & Gas Purification" },
  { name: "Mercury Removal" },
  { name: "Food & Beverage" },
  { name: "Energy Storage" },
  { name: "Catalyst Support" },
  { name: "Automotive Filters" },
  { name: "Medical & Pharma" },
  { name: "Nuclear Applications" },
  { name: "EDLC" },
  { name: "Silicon Anodes" },
  { name: "Lithium Iron Batteries" },
  { name: "Carbon Block Filters" },
  { name: "Activated Carbon for Gold Recovery" },
  { name: "Activated Carbon for EDLC" },
  { name: "Activated Carbon for Silicon Anodes" },
  { name: "Jacobi Updates" },
  { name: "Jacobi Profile" },
  { name: "Haycarb Updates" },
];

const API_BASE = "https://scoutagent-xk4c.onrender.com"; // update after deploy

function App() {
  const [opportunities, setOpportunities] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("PFAS");
  const [loading, setLoading] = useState(false);

  const fetchData = async (product = "PFAS") => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE}/opportunities?product=${encodeURIComponent(product)}`
      );
      // Ensure Jacobi Profile data is always an array
      const data = Array.isArray(res.data) ? res.data : [res.data];
      setOpportunities(data);
      setFiltered(data);
    } catch (err) {
      console.error("Error fetching opportunities:", err);
      setOpportunities([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedProduct);
  }, [selectedProduct]);

  const applyFilter = (type) => {
    setFilterType(type);
    const now = new Date();

    setFiltered(
      opportunities.filter((opp) => {
        if (!opp.date) return false;
        const oppDate = new Date(opp.date);

        if (type === "day") {
          return oppDate.toDateString() === now.toDateString();
        } else if (type === "month") {
          return (
            oppDate.getMonth() === now.getMonth() &&
            oppDate.getFullYear() === now.getFullYear()
          );
        } else if (type === "year") {
          return oppDate.getFullYear() === now.getFullYear();
        }
        return true;
      })
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFilterDisplayText = () => {
    switch (filterType) {
      case "day":
        return "Today";
      case "month":
        return "This Month";
      case "year":
        return "This Year";
      default:
        return "All Time";
    }
  };

  const renderContent = () => {
    if (selectedProduct === "Haycarb Updates") {
      return (
        <div className="jacobi-haycarb-section">
          <h2>Haycarb Media Updates</h2>
          <div className="card-grid">
            {filtered.map((opp, idx) => (
              <div key={idx} className="card">
                <h2>{opp.title}</h2>
                <div className="meta">
                  <strong>Date:</strong> {formatDate(opp.pub_date || opp.date)}
                </div>
                <p className="summary">{opp.summary || opp.description}</p>
                <a href={opp.link} target="_blank" rel="noreferrer" className="read-more">
                  🔗 Read Full Article
                </a>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (selectedProduct === "Jacobi Updates") {
      return (
        <div className="jacobi-haycarb-section">
          <h2>Jacobi News Updates</h2>
          <ul className="updates-list">
            {filtered.map((item, idx) => (
              <li key={idx}>
                <a href={item.link} target="_blank" rel="noreferrer">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (selectedProduct === "Jacobi Profile") {
      return (
        <div className="jacobi-profile-section">
          <h2>Jacobi Carbons – Company Profile</h2>
          {filtered.length > 0 && (
            <div className="profile-card">
              <h3>{filtered[0].company_name}</h3>
              <p><strong>Founded:</strong> {filtered[0].founded}</p>
              <p><strong>Products:</strong> {filtered[0].product_range}</p>
              <p>
                <strong>Website:</strong>{" "}
                <a href={filtered[0].website} target="_blank" rel="noreferrer">
                  {filtered[0].website}
                </a>
              </p>
              <p><strong>Address:</strong> {filtered[0].address}</p>
            </div>
          )}
        </div>
      );
    }

    // Default UI
    return (
      <>
        <div className="results-summary">
          <strong>{filtered.length}</strong> opportunities for{" "}
          <strong>{selectedProduct}</strong>
        </div>
        <div className="card-grid">
          {filtered.map((opp, idx) => (
            <div key={idx} className="card">
              <h2>{opp.title}</h2>
              <div className="meta">
                <strong>Source:</strong> {opp.source} <br />
                <strong>Date:</strong> {formatDate(opp.date)}
              </div>
              <p className="summary">{opp.summary}</p>
              <a href={opp.link} target="_blank" rel="noreferrer" className="read-more">
                🔗 Read Full Article
              </a>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>HAYCARB Market Scout</h1>
        <p>Stay ahead with real-time environmental & market intelligence</p>

        {/* Product Dropdown */}
        <div className="product-filter">
          <label htmlFor="product" className="dropdown-label">
            Select Product:
          </label>
          <select
            id="product"
            className="dropdown"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            {PRODUCTS.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Time Filters (skip for Jacobi/Haycarb/Profile) */}
        {!(["Jacobi Updates", "Jacobi Profile", "Haycarb Updates"].includes(selectedProduct)) && (
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
        )}

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
          <div className="loading">⏳ Loading {selectedProduct} updates...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <h3>No updates found</h3>
            <p>
              No updates for <strong>{selectedProduct}</strong> (
              {getFilterDisplayText()}).
            </p>
          </div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
}

export default App;
