import { useState } from 'react';
import axios from 'axios';

function ReservationModal({ stand, onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });
  const [step, setStep] = useState(1); // 1 = Formulario, 2 = Pago
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.email || !formData.telefono) {
      alert("❌ Por favor completa todos los campos");
      return;
    }
    setStep(2);
  };

  // Función para pagar con Mercado Pago
  const handleMercadoPago = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/pago', {
        titulo: `Reserva Stand - ${stand.nombre}`,
        precio: stand.precio
      });

      if (response.data.success && response.data.init_point) {
        // Redirigir al checkout de Mercado Pago (Sandbox)
        window.location.href = response.data.init_point;
      } else {
        alert("No se pudo generar el enlace de pago");
      }
    } catch (error) {
      console.error(error);
      alert("Error al conectar con Mercado Pago. Revisa que el backend esté corriendo.");
    } finally {
      setLoading(false);
    }
  };

  if (!stand) return null;

  return (
    <div style={{
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
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        width: '90%',
        maxWidth: '480px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h2>Reservar: {stand.nombre}</h2>
        <p><strong>Precio:</strong> ${stand.precio}</p>

        {step === 1 ? (
          <form onSubmit={handleSubmit}>
            <label>Nombre Completo *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '6px' }}
            />

            <label>Correo Electrónico *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '6px' }}
            />

            <label>Teléfono *</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '6px' }}
            />

            <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
              <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px' }}>
                Cancelar
              </button>
              <button type="submit" style={{ 
                flex: 1, 
                padding: '12px', 
                background: '#1e3a8a', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px' 
              }}>
                Continuar al Pago →
              </button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <h3>Resumen de tu Reserva</h3>
            <p><strong>Stand:</strong> {stand.nombre}</p>
            <p><strong>Precio Total:</strong> ${stand.precio}</p>
            <p><strong>Nombre:</strong> {formData.nombre}</p>
            <p><strong>Email:</strong> {formData.email}</p>

            <button 
              onClick={handleMercadoPago}
              disabled={loading}
              style={{
                marginTop: '25px',
                padding: '16px 30px',
                background: '#00B050',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '18px',
                width: '100%',
                cursor: 'pointer'
              }}
            >
              {loading ? "Procesando..." : "💳 Pagar con Mercado Pago"}
            </button>

            <button onClick={() => setStep(1)} style={{ marginTop: '10px' }}>
              ← Volver
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReservationModal;