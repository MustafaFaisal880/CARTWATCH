# 🛒 CartWatch

> A real-time grocery bill tracker. Know your total before you hit the checkout.

---

## What It Does

CartWatch is a mobile-first React app you use **while physically shopping**. Build your list at home, then as you walk the aisles and pick items off the shelf — type in the unit price. The running total updates instantly.

No more checkout sticker shock.

---

## Features

- **Live running total** — updates on every keystroke
- **Budget guard** — set a budget; the UI shifts green → amber → red as you approach it
- **Circular progress ring** — visual at-a-glance budget consumption
- **Per-item subtotals** — enter unit price × quantity automatically
- **Strikethrough on price entry** — satisfying visual confirmation as you go
- **Spending by category** — see where your money is going (Produce, Dairy, Meat, etc.)
- **"Can I Afford It?" scratch pad** — test any unplanned item before committing
- **Add / remove items** on the fly
- **Reset all prices** — for a fresh shopping run next time

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 (hooks only, no class components) |
| Styling | Plain CSS-in-JS (no dependencies) |
| Fonts | Playfair Display + IBM Plex Mono (Google Fonts) |
| State | `useState` — no external state library needed |
| Backend | None — fully client-side |

---

## Getting Started

### 1. Clone / create a Vite project

```bash
npm create vite@latest cartwatch -- --template react
cd cartwatch
```

### 2. Drop in the component

Replace `src/App.jsx` with `CartWatch.jsx`.

Then update `src/main.jsx` to import it:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import CartWatch from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartWatch />
  </React.StrictMode>
)
```

### 3. Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173` — or open it on your phone via your local network IP.

---

## Project Structure

```
cartwatch/
├── src/
│   └── App.jsx        ← entire app lives here (single file)
├── index.html
├── package.json
└── vite.config.js
```

Everything is intentionally in one file — no component sprawl for a project this size.

---

## How to Use It

1. **Before the store** — review the pre-loaded list or add your own items. Set your budget in the top-right.
2. **In the store** — as you pick up each item, type the shelf price into its field.
3. **Watch the total** — the running total and progress ring update live. The color tells you where you stand.
4. **Impulse buy?** — use the "Can I Afford It?" section at the bottom to test the item before putting it in your cart.
5. **Next trip** — hit "Reset All Prices" to clear all prices while keeping your list intact.

---

## Customizing Your List

Edit the `DEFAULT_ITEMS` array near the top of `CartWatch.jsx`:

```js
const DEFAULT_ITEMS = [
  { id: 1, name: "Whole Milk",  qty: 2, category: "Dairy",   price: "" },
  { id: 2, name: "Sourdough",   qty: 1, category: "Pantry",  price: "" },
  // add your own...
];
```

Available categories: `Produce`, `Dairy`, `Meat`, `Pantry`, `Drinks`, `Snacks`, `Household`, `Other`

---

## Making It a PWA (Optional)

To install CartWatch on your phone's home screen like a native app:

```bash
npm install vite-plugin-pwa -D
```

Then add to `vite.config.js`:

```js
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'CartWatch',
        short_name: 'CartWatch',
        theme_color: '#1a1814',
        display: 'standalone',
      }
    })
  ]
}
```

Build and serve — you'll get an "Add to Home Screen" prompt on mobile.

---


<img width="929" height="1254" alt="image" src="https://github.com/user-attachments/assets/a489286d-58d4-4a44-9ef2-6f56f43e7d93" />

