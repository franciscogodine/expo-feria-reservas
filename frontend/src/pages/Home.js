import { useEffect, useState } from 'react';
import axios from 'axios';
import StandMap from "../components/StandMap";

function Home() {
  const [stands, setStands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/stands')
      .then(response => {
        setStands(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* HERO SECTION - Introducción atractiva */}
      <div style={{
        background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2070")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '120px 20px'
      }}>
        <h1 style={{ fontSize: '52px', marginBottom: '20px' }}>
          Expo Feria Comercial 2026
        </h1>
        <p style={{ fontSize: '24px', maxWidth: '800px', margin: '0 auto 30px' }}>
          Reserva los mejores stands para tu negocio. 
          Más de 100 espacios disponibles en un recinto moderno.
        </p>
        <a href="#mapa" style={{
          background: '#1e3a8a',
          color: 'white',
          padding: '16px 40px',
          fontSize: '20px',
          borderRadius: '50px',
          textDecoration: 'none',
          display: 'inline-block'
        }}>
          Ver Plano Interactivo
        </a>
      </div>

      {/* Sección de Beneficios */}
      <div style={{ padding: '60px 20px', background: '#f8fafc', textAlign: 'center' }}>
        <h2>¿Por qué reservar con nosotros?</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '40px', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: '300px' }}>
            <h3>📍 Ubicación Prime</h3>
            <p>Stands en las mejores zonas del recinto</p>
          </div>
          <div style={{ maxWidth: '300px' }}>
            <h3>💰 Precios Transparentes</h3>
            <p>Paga seguro con Mercado Pago</p>
          </div>
          <div style={{ maxWidth: '300px' }}>
            <h3>⚡ Reserva Instantánea</h3>
            <p>Confirma tu stand en minutos</p>
          </div>
        </div>
      </div>

      {/* Mapa Interactivo */}
      <div id="mapa" style={{ padding: '40px 20px', background: '#fff' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Plano Interactivo de Stands</h2>
        {loading ? (
          <h3 style={{ textAlign: 'center' }}>Cargando mapa...</h3>
        ) : (
          <StandMap stands={stands} />
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: '#1e3a8a', color: 'white', textAlign: 'center', padding: '40px 20px' }}>
        <p>© 2026 Expo Feria Comercial - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}

export default Home;