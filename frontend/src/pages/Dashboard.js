import { useEffect, useState } from "react";

function Dashboard() {

  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    obtenerReservas();
  }, []);

  const obtenerReservas = async () => {
    try {

      const response = await fetch(
        "http://127.0.0.1:5000/api/reservas"
      );

      const data = await response.json();

      console.log(data);

      setReservas(data);

    } catch (error) {

      console.error(error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px"
        }}
      >
        <div style={cardStyle}>
          <h2>{reservas.length}</h2>
          <p>Reservas Totales</p>
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Lista de Reservas</h2>

        {
          reservas.map((reserva) => (

            <div
              key={reserva.id_reserva}
              style={{
                backgroundColor: "white",
                padding: "20px",
                marginTop: "15px",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
              }}
            >
              <h3>{reserva.nombre}</h3>

              <p>
                <strong>Correo:</strong> {reserva.email}
              </p>

              <p>
                <strong>Stand:</strong> {reserva.stand}
              </p>

              <p>
                <strong>Estado:</strong> {reserva.estado_reserva}
              </p>

              <p>
                <strong>Total:</strong> ${reserva.total_pagado}
              </p>

            </div>
          ))
        }

      </div>

    </div>
  );
}

const cardStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  width: "220px"
};

export default Dashboard;