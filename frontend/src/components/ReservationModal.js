import { useState } from 'react';
import axios from 'axios';

function ReservationModal({ stand, onClose }) {

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });

  const [loading, setLoading] = useState(false);

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  // ✅ RESERVAR SIN PAGAR
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !formData.nombre ||
      !formData.email ||
      !formData.telefono
    ) {

      alert("❌ Completa todos los campos");
      return;
    }

    setLoading(true);

    try {

      await axios.post(
        `${API_URL}/api/reservas`,
        {
          nombre: formData.nombre,
          correo: formData.email,
          stand: stand.id_stand
        }
      );

      alert("✅ Reserva realizada correctamente");

      window.location.reload();

    } catch (error) {

      console.log(error);

      alert("❌ Error al realizar reserva");

    } finally {

      setLoading(false);
    }
  };

  if (!stand) return null;

  return (

    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.75)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000
      }}
    >

      <div
        style={{
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          width: '90%',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >

        <h2>
          Reservar: {stand.nombre}
        </h2>

        <p>
          <strong>Precio:</strong>
          ${stand.precio}
        </p>

        <form onSubmit={handleSubmit}>

          <label>
            Nombre Completo *
          </label>

          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              margin: '8px 0',
              borderRadius: '6px'
            }}
          />

          <label>
            Correo Electrónico *
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              margin: '8px 0',
              borderRadius: '6px'
            }}
          />

          <label>
            Teléfono *
          </label>

          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              margin: '8px 0',
              borderRadius: '6px'
            }}
          />

          <div
            style={{
              marginTop: '25px',
              display: 'flex',
              gap: '10px'
            }}
          >

            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px'
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                background: '#1e3a8a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >

              {
                loading
                  ? "Guardando..."
                  : "✅ Confirmar Reserva"
              }

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ReservationModal;