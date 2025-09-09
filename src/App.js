import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

// Products with optional reference links
const PRODUCTS = [
  { name: "PFAS", link: "https://www.epa.gov/pfas" },
  { name: "Soil Remediation", link: "https://www.sciencedirect.com/topics/earth-and-planetary-sciences/soil-remediation" },
  { name: "Mining", link: "https://www.mining.com" },
  { name: "Gold Recovery", link: "https://www.sciencedirect.com/topics/earth-and-planetary-sciences/gold-recovery" },
  { name: "Drinking Water", link: "https://www.who.int/news-room/fact-sheets/detail/drinking-water" },
  { name: "Wastewater Treatment", link: "https://www.sciencedirect.com/topics/earth-and-planetary-sciences/wastewater-treatment" },
  { name: "Air & Gas Purification", link: "https://www.sciencedirect.com/topics/earth-and-planetary-sciences/air-purification" },
  { name: "Mercury Removal", link: "https://www.epa.gov/mercury" },
  { name: "Food & Beverage", link: "https://www.sciencedirect.com/topics/food-science/activated-carbon" },
  { name: "Energy Storage", link: "https://www.sciencedirect.com/topics/engineering/energy-storage" },
  { name: "Catalyst Support", link: "https://www.sciencedirect.com/topics/engineering/catalyst-support" },
  { name: "Automotive Filters", link: "https://www.sciencedirect.com/topics/engineering/automotive-filters" },
  { name: "Medical & Pharma", link: "https://www.sciencedirect.com/topics/medicine-and-dentistry/activated-carbon" },
  { name: "Nuclear Applications", link: "https://www.sciencedirect.com/topics/engineering/nuclear-technology" },
  { name: "EDLC", link: "https://www.sciencedirect.com/science/article/pii/S0264127522006396" },
  { name: "Silicon Anodes", link: "https://www.e-nxtrade.com/en/product/list/id/18" },
  { name: "Lithium Iron Batteries", link: "https://www.sciencedirect.com/topics/engineering/lithium-iron-phosphate" },
  { name: "Carbon Block Filters", link: "https://www.sciencedirect.com/topics/engineering/carbon-block" },

];

const API_BASE = "http://localhost:8000"; // change this after deploy

function App() {
  const [opportunities, setOpportunities] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("PFAS");
  const [loading, setLoading] = useState(false);

  // Fetch data from backend
  const fetchData = async (product = "PFAS") => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE}/opportunities?product=${encodeURIComponent(product)}`
      );
      setOpportunities(res.data);
      setFiltered(res.data);
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

  // Apply day/month/year filters
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
        return true; // "all"
      })
    );
  };

  // Format dates nicely
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
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  // Filter label
  const getFilterDisplayText = () => {
    switch (filterType) {
      case "day": return "Today";
      case "month": return "This Month";
      case "year": return "This Year";
      default: return "All Time";
    }
  };

  const currentProduct = PRODUCTS.find((p) => p.name === selectedProduct);

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
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Reference Link */}
        {currentProduct?.link && (
          <a
            href={currentProduct.link}
            target="_blank"
            rel="noreferrer"
            className="reference-link"
          >
            📖 Learn more about {selectedProduct}
          </a>
        )}

        {/* Time Filters */}
        <div className="filter-buttons">
          <button className={filterType === "all" ? "active" : ""} onClick={() => applyFilter("all")}>🌎 All</button>
          <button className={filterType === "day" ? "active" : ""} onClick={() => applyFilter("day")}>📅 Today</button>
          <button className={filterType === "month" ? "active" : ""} onClick={() => applyFilter("month")}>🗓️ This Month</button>
          <button className={filterType === "year" ? "active" : ""} onClick={() => applyFilter("year")}>📆 This Year</button>
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
          <div className="loading">⏳ Loading latest {selectedProduct} opportunities...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <h3>No opportunities found</h3>
            <p>No opportunities for <strong>{selectedProduct}</strong> ({getFilterDisplayText()}).</p>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                background: "white",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <strong>{filtered.length}</strong> opportunities found for <strong>{selectedProduct}</strong>
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "var(--success)",
                    animation: "pulse 2s infinite",
                  }}
                ></span>
                Filter: {getFilterDisplayText()}
              </div>
            </div>

            {/* Cards */}
            <div className="card-grid">
              {filtered.map((opp, index) => (
                <div key={opp.link || index} className="card">
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
