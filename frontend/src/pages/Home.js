import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

import StandMap from "../components/StandMap";

function Home() {

  const [stands, setStands] = useState([]);

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";

  useEffect(() => {
    obtenerStands();
  }, []);

  const obtenerStands = async () => {

    try {

      const res = await axios.get(
        `${API_URL}/api/stands`
      );

      setStands(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  return (

    <div className="home-container">

      {/* HERO */}
      <section
        className="hero"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1600')"
        }}
      >

        <div className="hero-overlay" />

        <div className="hero-content">

          <h1 className="hero-title">
            Expo Feria Comercial 2026
          </h1>

          <p className="hero-subtitle">
            Descubre los mejores espacios
            comerciales en los lugares más
            emblemáticos de la Ciudad de México.
          </p>

          <p className="hero-text">
            🚀 Reserva tu stand antes que todos.
          </p>

        </div>

      </section>

      {/* TARJETAS PREMIUM */}
      <section className="cards-section">

        <div className="premium-card">

          <img
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200"
            alt=""
            className="card-image"
          />

          <div className="card-content">

            <h3>
              🏟️ Ubicaciones Premium
            </h3>

            <p>
              Espacios exclusivos en zonas
              emblemáticas de CDMX.
            </p>

          </div>

        </div>

        <div className="premium-card">

          <img
            src="https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?q=80&w=1200"
            alt=""
            className="card-image"
          />

          <div className="card-content">

            <h3>
              📍 Ciudad de México
            </h3>

            <p>
              Museos, plazas y lugares
              icónicos para tu negocio.
            </p>

          </div>

        </div>

        <div className="premium-card">

          <img
            src="https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1200"
            alt=""
            className="card-image"
          />

          <div className="card-content">

            <h3>
              💼 Networking Empresarial
            </h3>

            <p>
              Conecta con empresas,
              clientes e inversionistas.
            </p>

          </div>

        </div>

        <div className="premium-card">

          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200"
            alt=""
            className="card-image"
          />

          <div className="card-content">

            <h3>
              🎯 Miles de visitantes
            </h3>

            <p>
              Mayor visibilidad para
              impulsar tu marca.
            </p>

          </div>

        </div>

      </section>

      {/* MAPA */}
      <StandMap
        stands={stands}
        onRefresh={obtenerStands}
      />

      {/* BENEFICIOS */}
      <section className="benefits-section">

        <h2 className="benefits-title">
          🌟 ¿Por qué participar?
        </h2>

        <div className="benefits-grid">

          <div className="info-card">

            <h3>
              📈 Mayor Visibilidad
            </h3>

            <p>
              Miles de personas podrán ver
              tu negocio durante el evento.
            </p>

          </div>

          <div className="info-card">

            <h3>
              🤝 Nuevos Clientes
            </h3>

            <p>
              Conecta con empresas,
              inversionistas y clientes.
            </p>

          </div>

          <div className="info-card">

            <h3>
              🏙️ Lugares Icónicos
            </h3>

            <p>
              Stands en zonas emblemáticas
              como el Estadio Azteca,
              museos y plazas.
            </p>

          </div>

          <div className="info-card">

            <h3>
              💳 Reservas Rápidas
            </h3>

            <p>
              Reserva y administra tu
              espacio en línea fácilmente.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;