import { useEffect, useState } from "react";

function Reservas() {

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
      <h1>Mis Reservas</h1>

      <table
        style={{
          width: "100%",
          backgroundColor: "white",
          borderCollapse: "collapse",
          marginTop: "20px"
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>Expositor</th>
            <th style={thStyle}>Correo</th>
            <th style={thStyle}>Stand</th>
            <th style={thStyle}>Estado</th>
            <th style={thStyle}>Precio</th>
          </tr>
        </thead>

        <tbody>

          {
            reservas.map((reserva) => (

              <tr key={reserva.id_reserva}>

                <td style={tdStyle}>
                  {reserva.nombre}
                </td>

                <td style={tdStyle}>
                  {reserva.email}
                </td>

                <td style={tdStyle}>
                  {reserva.stand}
                </td>

                <td style={tdStyle}>
                  {reserva.estado_reserva}
                </td>

                <td style={tdStyle}>
                  ${reserva.total_pagado}
                </td>

              </tr>
            ))
          }

        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  backgroundColor: "#1e3a8a",
  color: "white"
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "10px"
};

export default Reservas;