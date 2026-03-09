import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { label: "Produce",   emoji: "🥦", color: "#2d6a4f" },
  { label: "Dairy",     emoji: "🥛", color: "#1d6fa4" },
  { label: "Meat",      emoji: "🥩", color: "#a4261d" },
  { label: "Pantry",    emoji: "🥫", color: "#b5620a" },
  { label: "Drinks",    emoji: "🧃", color: "#0a6b7c" },
  { label: "Snacks",    emoji: "🧁", color: "#7c3d82" },
  { label: "Household", emoji: "🧴", color: "#4a4a4a" },
  { label: "Other",     emoji: "📦", color: "#777" },
];

const DEFAULT_ITEMS = [
  { id: 1, name: "Whole Milk",      qty: 2, category: "Dairy",     price: "" },
  { id: 2, name: "Sourdough Bread", qty: 1, category: "Pantry",    price: "" },
  { id: 3, name: "Chicken Breast",  qty: 1, category: "Meat",      price: "" },
  { id: 4, name: "Broccoli",        qty: 3, category: "Produce",   price: "" },
  { id: 5, name: "Orange Juice",    qty: 1, category: "Drinks",    price: "" },
  { id: 6, name: "Cheddar Cheese",  qty: 1, category: "Dairy",     price: "" },
  { id: 7, name: "Pasta",           qty: 2, category: "Pantry",    price: "" },
  { id: 8, name: "Eggs (12pk)",     qty: 1, category: "Dairy",     price: "" },
  { id: 9, name: "Dish Soap",       qty: 1, category: "Household", price: "" },
];

const getCatMeta = (label) =>
  CATEGORIES.find((c) => c.label === label) || CATEGORIES[7];

let nextId = 100;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --paper: #f5f0e8;
    --paper2: #ede7d9;
    --ink: #1a1814;
    --ink2: #4a4540;
    --ink3: #8a8580;
    --line: #d8d0c4;
    --accent: #c8402a;
    --accent2: #e85a3a;
    --green: #2d6a4f;
    --white: #ffffff;
    --shadow: 0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05);
    --shadow-lg: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
  }

  body {
    font-family: 'IBM Plex Mono', monospace;
    background: var(--paper2);
    color: var(--ink);
    min-height: 100vh;
  }

  /* noise texture overlay */
  body::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 9999; opacity: 0.6;
  }

  .app {
    max-width: 480px;
    margin: 0 auto;
    padding: 0 0 120px 0;
    position: relative;
  }

  /* ── Header ── */
  .header {
    background: var(--ink);
    color: var(--paper);
    padding: 28px 24px 20px;
    position: sticky; top: 0; z-index: 100;
    border-bottom: 3px solid var(--accent);
  }
  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .brand {
    font-family: 'Playfair Display', serif;
    font-weight: 900;
    font-size: 2rem;
    letter-spacing: -1px;
    line-height: 1;
    color: var(--paper);
  }
  .brand span { color: var(--accent2); }
  .tagline {
    font-size: 0.6rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #6a6560;
    margin-top: 3px;
  }
  .budget-badge {
    text-align: right;
  }
  .budget-label {
    font-size: 0.55rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #6a6560;
  }
  .budget-input-wrap {
    display: flex;
    align-items: center;
    gap: 2px;
    justify-content: flex-end;
  }
  .budget-symbol {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    color: #aaa;
  }
  .budget-input {
    background: transparent;
    border: none;
    border-bottom: 1px solid #333;
    color: var(--paper);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 1.1rem;
    font-weight: 500;
    width: 72px;
    text-align: right;
    outline: none;
    padding: 2px 0;
  }

  /* budget bar */
  .budget-bar-wrap { margin-top: 14px; }
  .budget-bar-track {
    height: 3px;
    background: #2a2a2a;
    border-radius: 2px;
    overflow: hidden;
  }
  .budget-bar-fill {
    height: 3px;
    border-radius: 2px;
    transition: width 0.35s cubic-bezier(0.4,0,0.2,1), background 0.35s;
  }
  .budget-bar-meta {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    font-size: 0.6rem;
    color: #5a5550;
    letter-spacing: 1px;
  }

  /* ── Total ticker ── */
  .total-ticker {
    background: var(--white);
    margin: 16px 16px 0;
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: var(--shadow);
    border: 1px solid var(--line);
  }
  .total-left {}
  .total-label {
    font-size: 0.6rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--ink3);
  }
  .total-amount {
    font-family: 'Playfair Display', serif;
    font-weight: 900;
    font-size: 2.4rem;
    letter-spacing: -2px;
    line-height: 1;
    transition: color 0.3s;
  }
  .total-remaining {
    font-size: 0.7rem;
    margin-top: 3px;
  }
  .total-right {
    text-align: right;
  }
  .progress-ring-wrap { position: relative; width: 56px; height: 56px; }
  .progress-ring-wrap svg { transform: rotate(-90deg); }
  .progress-ring-pct {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.65rem; font-weight: 500; letter-spacing: -0.5px;
  }

  /* ── Stats row ── */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin: 10px 16px 0;
  }
  .stat-card {
    background: var(--white);
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 10px 12px;
    text-align: center;
    box-shadow: var(--shadow);
  }
  .stat-val {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: 1.25rem;
    letter-spacing: -1px;
    color: var(--ink);
  }
  .stat-lbl {
    font-size: 0.55rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--ink3);
    margin-top: 2px;
  }

  /* ── Section header ── */
  .section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 16px 8px;
  }
  .section-title {
    font-size: 0.6rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--ink3);
  }
  .section-count {
    font-size: 0.6rem;
    color: var(--ink3);
  }

  /* ── Item card ── */
  .item-card {
    background: var(--white);
    border: 1px solid var(--line);
    border-radius: 12px;
    margin: 0 16px 8px;
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: transform 0.15s, box-shadow 0.15s;
    animation: slideIn 0.25s ease-out;
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .item-card:hover { transform: translateY(-1px); box-shadow: var(--shadow-lg); }
  .item-card.priced { border-left: 3px solid var(--green); }

  .item-inner {
    display: flex;
    align-items: center;
    padding: 12px 14px;
    gap: 10px;
  }

  .cat-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .item-info { flex: 1; min-width: 0; }
  .item-name {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.2s, text-decoration 0.2s;
  }
  .item-name.done {
    text-decoration: line-through;
    color: var(--ink3);
  }
  .item-meta {
    font-size: 0.6rem;
    color: var(--ink3);
    margin-top: 2px;
    letter-spacing: 0.5px;
  }

  .item-price-wrap {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }
  .price-symbol { font-size: 0.75rem; color: var(--ink3); }
  .price-input {
    width: 68px;
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 6px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--ink);
    text-align: right;
    padding: 6px 8px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .price-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(200,64,42,0.1);
  }
  .price-input.filled {
    background: #f0faf4;
    border-color: var(--green);
    color: var(--green);
    font-weight: 500;
  }

  .subtotal-chip {
    font-size: 0.65rem;
    font-weight: 500;
    color: var(--green);
    background: #f0faf4;
    border: 1px solid #c8e6d4;
    border-radius: 20px;
    padding: 2px 7px;
    white-space: nowrap;
  }

  .del-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #ccc;
    font-size: 1rem;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.15s, background 0.15s;
    line-height: 1;
  }
  .del-btn:hover { color: var(--accent); background: #fdf0ee; }

  /* ── Add item ── */
  .add-section {
    margin: 0 16px;
    background: var(--white);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 16px;
    box-shadow: var(--shadow);
  }
  .add-title {
    font-size: 0.6rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--ink3);
    margin-bottom: 12px;
  }
  .add-row {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
  }
  .add-input {
    flex: 1;
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.85rem;
    color: var(--ink);
    padding: 9px 12px;
    outline: none;
    transition: border-color 0.15s;
  }
  .add-input:focus { border-color: var(--accent); }
  .qty-input {
    width: 52px;
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.85rem;
    color: var(--ink);
    padding: 9px 8px;
    text-align: center;
    outline: none;
  }
  .cat-select {
    flex: 1;
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.78rem;
    color: var(--ink);
    padding: 9px 10px;
    outline: none;
    appearance: none;
    cursor: pointer;
  }
  .add-btn {
    width: 100%;
    background: var(--ink);
    color: var(--paper);
    border: none;
    border-radius: 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 11px;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    margin-top: 4px;
  }
  .add-btn:hover { background: var(--accent); }
  .add-btn:active { transform: scale(0.98); }

  /* ── Scratch pad ── */
  .scratch-section {
    margin: 8px 16px 0;
    background: #fffbf0;
    border: 1px dashed #d4c9a8;
    border-radius: 12px;
    padding: 14px 16px;
  }
  .scratch-title {
    font-size: 0.6rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--ink3);
    margin-bottom: 10px;
  }
  .scratch-row { display: flex; gap: 8px; align-items: center; }
  .scratch-result {
    margin-top: 10px;
    font-size: 0.78rem;
    padding: 8px 12px;
    border-radius: 6px;
    font-weight: 500;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
  .scratch-ok  { background: #f0faf4; color: var(--green); border: 1px solid #c8e6d4; }
  .scratch-bad { background: #fdf0ee; color: var(--accent); border: 1px solid #f5c9c0; }

  /* ── Cat breakdown ── */
  .cat-section {
    margin: 8px 16px 0;
    background: var(--white);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 14px 16px;
    box-shadow: var(--shadow);
  }
  .cat-title {
    font-size: 0.6rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--ink3);
    margin-bottom: 12px;
  }
  .cat-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }
  .cat-name {
    font-size: 0.72rem;
    color: var(--ink2);
    width: 80px;
    flex-shrink: 0;
  }
  .cat-bar-track {
    flex: 1;
    height: 5px;
    background: var(--paper2);
    border-radius: 3px;
    overflow: hidden;
  }
  .cat-bar-fill {
    height: 5px;
    border-radius: 3px;
    transition: width 0.4s cubic-bezier(0.4,0,0.2,1);
  }
  .cat-amt {
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--ink);
    width: 44px;
    text-align: right;
    flex-shrink: 0;
  }

  /* ── Reset btn ── */
  .reset-btn {
    display: block;
    width: calc(100% - 32px);
    margin: 8px 16px 0;
    background: transparent;
    border: 1px solid var(--line);
    border-radius: 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--ink3);
    padding: 10px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .reset-btn:hover { border-color: var(--accent); color: var(--accent); background: #fdf0ee; }

  /* scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--line); border-radius: 2px; }
`;

// ── Progress ring ──────────────────────────────────────────────────
function ProgressRing({ pct, color }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = circ - (pct / 100) * circ;
  return (
    <div className="progress-ring-wrap">
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#e8e0d0" strokeWidth="4" />
        <circle
          cx="28" cy="28" r={r}
          fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circ}
          strokeDashoffset={dash}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.4s cubic-bezier(0.4,0,0.2,1), stroke 0.3s" }}
        />
      </svg>
      <div className="progress-ring-pct" style={{ color }}>{Math.round(pct)}%</div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────
export default function CartWatch() {
  const [items, setItems]   = useState(DEFAULT_ITEMS);
  const [budget, setBudget] = useState(100);
  const [newName, setNewName] = useState("");
  const [newQty, setNewQty]   = useState(1);
  const [newCat, setNewCat]   = useState("Produce");
  const [scratchPrice, setScratchPrice] = useState("");
  const [scratchQty, setScratchQty]     = useState(1);
  const nameRef = useRef(null);

  const total = items.reduce(
    (sum, it) => sum + (parseFloat(it.price) || 0) * it.qty, 0
  );
  const pricedCount = items.filter((it) => it.price !== "").length;
  const budgetPct   = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;
  const remaining   = budget - total;
  const avgPrice    = pricedCount > 0 ? total / pricedCount : 0;

  const accentColor =
    budgetPct < 70 ? "#2d6a4f" : budgetPct < 90 ? "#c88a0a" : "#c8402a";

  // Category totals
  const catTotals = {};
  items.forEach((it) => {
    if (it.price !== "") {
      catTotals[it.category] = (catTotals[it.category] || 0) + parseFloat(it.price) * it.qty;
    }
  });
  const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);

  const updatePrice = (id, val) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, price: val } : it))
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const addItem = () => {
    if (!newName.trim()) return;
    setItems((prev) => [
      ...prev,
      { id: nextId++, name: newName.trim(), qty: newQty, category: newCat, price: "" },
    ]);
    setNewName("");
    setNewQty(1);
    nameRef.current?.focus();
  };

  const resetPrices = () => {
    setItems((prev) => prev.map((it) => ({ ...it, price: "" })));
  };

  // scratch pad logic
  const scratchHypothetical =
    scratchPrice !== "" ? total + parseFloat(scratchPrice || 0) * scratchQty : null;
  const scratchOk =
    scratchHypothetical !== null && scratchHypothetical <= budget;

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* ── Header ── */}
        <div className="header">
          <div className="header-top">
            <div>
              <div className="brand">Cart<span>Watch</span></div>
              <div className="tagline">In-store bill tracker</div>
            </div>
            <div className="budget-badge">
              <div className="budget-label">Budget</div>
              <div className="budget-input-wrap">
                <span className="budget-symbol">$</span>
                <input
                  className="budget-input"
                  type="number"
                  min="1"
                  value={budget}
                  onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
          <div className="budget-bar-wrap">
            <div className="budget-bar-track">
              <div
                className="budget-bar-fill"
                style={{ width: `${budgetPct}%`, background: accentColor }}
              />
            </div>
            <div className="budget-bar-meta">
              <span>{pricedCount} of {items.length} priced</span>
              <span style={{ color: accentColor }}>
                {remaining >= 0 ? `$${remaining.toFixed(2)} left` : `$${Math.abs(remaining).toFixed(2)} over`}
              </span>
            </div>
          </div>
        </div>

        {/* ── Total ticker ── */}
        <div className="total-ticker">
          <div className="total-left">
            <div className="total-label">Running Total</div>
            <div className="total-amount" style={{ color: accentColor }}>
              ${total.toFixed(2)}
            </div>
            <div className="total-remaining" style={{ color: accentColor }}>
              {remaining >= 0
                ? `$${remaining.toFixed(2)} remaining`
                : `$${Math.abs(remaining).toFixed(2)} over budget`}
            </div>
          </div>
          <ProgressRing pct={budgetPct} color={accentColor} />
        </div>

        {/* ── Stats ── */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-val">${avgPrice.toFixed(2)}</div>
            <div className="stat-lbl">Avg/item</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">{pricedCount}/{items.length}</div>
            <div className="stat-lbl">Priced</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">{items.length - pricedCount}</div>
            <div className="stat-lbl">Remaining</div>
          </div>
        </div>

        {/* ── List ── */}
        <div className="section-head">
          <span className="section-title">Shopping List</span>
          <span className="section-count">{items.length} items</span>
        </div>

        {items.map((item) => {
          const cat   = getCatMeta(item.category);
          const priced = item.price !== "";
          const sub   = priced ? (parseFloat(item.price) * item.qty).toFixed(2) : null;
          return (
            <div key={item.id} className={`item-card ${priced ? "priced" : ""}`}>
              <div className="item-inner">
                <div className="cat-dot" style={{ background: cat.color }} />
                <div className="item-info">
                  <div className={`item-name ${priced ? "done" : ""}`}>{item.name}</div>
                  <div className="item-meta">
                    {cat.emoji} {item.category} · qty {item.qty}
                    {sub && (
                      <span className="subtotal-chip" style={{ marginLeft: 6 }}>
                        =${sub}
                      </span>
                    )}
                  </div>
                </div>
                <div className="item-price-wrap">
                  <span className="price-symbol">$</span>
                  <input
                    className={`price-input ${priced ? "filled" : ""}`}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={item.price}
                    onChange={(e) => updatePrice(item.id, e.target.value)}
                  />
                </div>
                <button className="del-btn" onClick={() => removeItem(item.id)}>✕</button>
              </div>
            </div>
          );
        })}

        {/* ── Add item ── */}
        <div className="section-head">
          <span className="section-title">Add Item</span>
        </div>
        <div className="add-section">
          <div className="add-row">
            <input
              ref={nameRef}
              className="add-input"
              placeholder="Item name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
            />
            <input
              className="qty-input"
              type="number"
              min="1"
              max="99"
              value={newQty}
              onChange={(e) => setNewQty(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="add-row">
            <select
              className="cat-select"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.label} value={c.label}>
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
          </div>
          <button className="add-btn" onClick={addItem}>+ Add to List</button>
        </div>

        {/* ── Scratch pad ── */}
        <div className="section-head">
          <span className="section-title">Can I Afford It?</span>
        </div>
        <div className="scratch-section">
          <div className="scratch-title">Test an unplanned item</div>
          <div className="scratch-row">
            <span className="price-symbol" style={{ fontSize: "0.85rem", color: "#8a8580" }}>$</span>
            <input
              className="add-input"
              style={{ flex: 1 }}
              type="number"
              min="0"
              step="0.01"
              placeholder="Unit price"
              value={scratchPrice}
              onChange={(e) => setScratchPrice(e.target.value)}
            />
            <span style={{ fontSize: "0.7rem", color: "#aaa" }}>×</span>
            <input
              className="qty-input"
              type="number"
              min="1"
              value={scratchQty}
              onChange={(e) => setScratchQty(parseInt(e.target.value) || 1)}
            />
          </div>
          {scratchHypothetical !== null && (
            <div className={`scratch-result ${scratchOk ? "scratch-ok" : "scratch-bad"}`}>
              {scratchOk
                ? `✓ Yes! New total $${scratchHypothetical.toFixed(2)} · $${(budget - scratchHypothetical).toFixed(2)} left`
                : `✗ Over by $${(scratchHypothetical - budget).toFixed(2)} · Total would be $${scratchHypothetical.toFixed(2)}`}
            </div>
          )}
        </div>

        {/* ── Category breakdown ── */}
        {sortedCats.length > 0 && (
          <>
            <div className="section-head">
              <span className="section-title">Spending by Category</span>
            </div>
            <div className="cat-section">
              {sortedCats.map(([cat, amt]) => {
                const meta = getCatMeta(cat);
                const pct  = total > 0 ? (amt / total) * 100 : 0;
                return (
                  <div key={cat} className="cat-row">
                    <div className="cat-name">{meta.emoji} {cat}</div>
                    <div className="cat-bar-track">
                      <div
                        className="cat-bar-fill"
                        style={{ width: `${pct}%`, background: meta.color }}
                      />
                    </div>
                    <div className="cat-amt">${amt.toFixed(2)}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── Reset ── */}
        <button className="reset-btn" onClick={resetPrices} style={{ marginTop: 16 }}>
          ↺ Reset All Prices
        </button>

      </div>
    </>
  );
}
