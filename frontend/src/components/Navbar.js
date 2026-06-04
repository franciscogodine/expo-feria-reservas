import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        backgroundColor: "#1e3a8a",
        color: "white",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
      }}
    >
      <h2 style={{ margin: 0 }}>
        Expo Feria Comercial
      </h2>

      <div style={{ display: "flex", gap: "15px" }}>
        <Link to="/" style={linkStyle}>
          Inicio
        </Link>

        <Link to="/reservas" style={linkStyle}>
          Reservas
        </Link>

        <Link to="/dashboard" style={linkStyle}>
          Dashboard
        </Link>

        <Link to="/login" style={linkStyle}>
          Login
        </Link>
      </div>
    </nav>
  );
}

const linkStyle = {
  backgroundColor: "white",
  color: "#1e3a8a",
  padding: "10px 15px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "bold"
};

export default Navbar;