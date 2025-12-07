import "./App.css";
import Dashboard from "./components/Dashboard.jsx";
import Loans from "./components/Loans.jsx";
import Navbar from "./components/Navbar.jsx";
import Profile from "./components/Profile.jsx";
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
            <Route path="/profile" element={<Profile />} />
            <Route path="/apply" element={<ApplyPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
