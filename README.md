# 💰 Personal Finance & Expense Tracker

A lightweight personal finance tracker built entirely with **vanilla JavaScript** — no frameworks, no libraries. This project was built as my final submission for Dicoding's *Front-End Web Pemula* class, focusing on DOM manipulation and browser storage.

## Features

- ➕ **Add transactions** — record income or expenses with a title, amount, and date
- 📊 **Live dashboard** — automatically calculates and displays your current balance, total income, and total expenses
- 🔄 **Reclassify transactions** — instantly move a transaction between Income and Expense with one click
- ✏️ **Edit transactions** — update an existing entry directly from the transaction card
- 🔍 **Search** — filter transaction history in real time by title
- 💾 **Persistent storage** — all data is saved to `localStorage`, so nothing is lost on page refresh

## Tech Stack

- HTML5
- CSS3 (custom design, BEM naming convention)
- JavaScript (ES6+) — no external libraries or frameworks
- Web Storage API (`localStorage`)

## Key Concepts Practiced

- DOM manipulation using `document.createElement()`
- Event handling (`submit`, `click`, `input`)
- Custom Events (`dispatchEvent` / `addEventListener`) to sync data changes with UI updates
- Form validation
- Data persistence with `JSON.stringify()` / `JSON.parse()`

## Getting Started

1. Clone this repository
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   ```
2. Open `index.html` in your browser — that's it, no build step required.

## Preview

*(tambahkan screenshot aplikasi kamu di sini)*

---

Built as part of my learning journey on [Dicoding](https://www.dicoding.com).
