import "./App.css";
import Dashboard from "./components/Dashboard.jsx";
import Loans from "./components/Loans.jsx";
import Management from "./components/Management.jsx";
import Navbar from "./components/Navbar.jsx";
import ApplyPage from "./pages/ApplyPage.jsx";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="app-root">
        {/* Navbar is always visible */}
        <Navbar />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/management" element={<Management />} />
            <Route path="/apply" element={<ApplyPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
