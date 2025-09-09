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

  return (
    <div className="app-container">
      <header className="header">
        <h1> AI Market Scout Dashboard</h1>
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
            🌍 All
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
        <button className="refresh-btn" onClick={() => fetchData(selectedProduct)}>
          🔄 Refresh
        </button>
      </header>

      <main className="main-content">
        {loading ? (
          <div className="loading">⏳ Loading latest updates...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            🚀 No opportunities found for {selectedProduct} ({filterType}).
          </div>
        ) : (
          <div className="card-grid">
            {filtered.map((opp) => (
              <div key={opp.id} className="card">
                <h2>{opp.title}</h2>
                <p className="meta">
                  <strong>Source:</strong> {opp.source} <br />
                  <strong>Date:</strong>{" "}
                  {opp.date ? new Date(opp.date).toLocaleString() : "N/A"}
                </p>
                <p className="summary">{opp.summary}</p>
                <a
                  href={opp.link}
                  target="_blank"
                  rel="noreferrer"
                  className="read-more"
                >
                  🔗 Read More
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
