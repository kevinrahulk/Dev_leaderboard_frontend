# StarHolder - Frontend Console

The React frontend client dashboard for **StarHolder**—a responsive, dark-themed metrics interface summarizing developer quality, sprint backlogs, and resolution speed. Built with **Vite**, **React**, **Redux Toolkit**, and **Material-UI (MUI)**.

---

## 🌟 Key Features

* **Active Project Dropdown**: Switch between multiple team project scopes dynamically in the header to load their individual sprint stats.
* **KPI Metrics Board**: Tracks top star developer, active engineers count, total bugs, and timeframe details.
* **Top Performers Podium**: Displays the top 3 engineers in a premium visual layout (ordered dynamically for mobile devices).
* **Interactive Backlog Share Chart**: Fenced stacked bar chart highlighting bugs distribution by priority (Highest, High, Medium, Low).
* **Project Management Page**: Create, edit, connection-test, and delete project integrations in a clean popup form layout.
* **Vibrant Responsive Design**: Optimized CSS grid stacking for mobile viewports, tablet screens, and desktop layouts.
* **LocalStorage Welcome Persistence**: Persists welcome banner dismissal state locally, keeping it hidden after initial close.

---

## 📁 Folder Structure

```text
src/
├── components/      # UI components (Header, Podium, BugChart, SettingsPage, Banner)
├── hooks/           # Redux wrappers & useLeaderboard reactive states controller
├── services/        # Axios API clients for backend endpoint routing
├── store/           # Redux slices and async sync/leaderboard thunks
├── theme.js         # Material UI custom theme variables (Dark/Light mode, border-radius)
├── main.jsx         # App bootstrapping
└── App.jsx          # Root view and snackbar layouts
```

---

## 🛠️ Getting Started

### 1. Prerequisites
* Node.js (v18+)
* npm (or yarn)

### 2. Installation
Install dependencies in the frontend folder:

```bash
npm install
```

### 3. Run Development Server
Start Vite development server:

```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
To bundle and minify the client resources:

```bash
npm run build
```
This builds static assets into the `dist/` directory.
