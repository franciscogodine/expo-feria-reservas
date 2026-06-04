import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Logins() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const iniciarSesion = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:5000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (data.success) {

        localStorage.setItem(
          "usuario",
          JSON.stringify(data.usuario)
        );

        alert("✅ Bienvenido");

        if (data.usuario.tipo_usuario === "admin") {

          navigate("/dashboard");

        } else {

          navigate("/reservas");
        }

      } else {

        alert(data.message);
      }

    } catch (error) {

      console.error(error);

      alert("❌ Error al iniciar sesión");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5"
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "10px",
          width: "350px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
        }}
      >
        <h2>Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={iniciarSesion}
          style={buttonStyle}
        >
          Ingresar
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "15px"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "20px",
  backgroundColor: "#1e3a8a",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: "6px"
};

export default Logins;