import "./App.css";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Logins from "./pages/Logins";
import Dashboard from "./pages/Dashboard";
import Reservas from "./pages/Reservas";
import AdminDashboard from "./pages/AdminDashboard";


import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Logins />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;