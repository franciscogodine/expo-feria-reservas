function Login() {
  return (
    <div>
      <h1>Iniciar Sesión</h1>

      <div
        style={{
          maxWidth: "400px",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
        }}
      >
        <input
          type="email"
          placeholder="Correo electrónico"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px"
          }}
        />

        <input
          type="password"
          placeholder="Contraseña"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px"
          }}
        />

        <button
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#1e3a8a",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}

export default Login;