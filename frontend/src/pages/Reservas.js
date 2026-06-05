import { useEffect, useState } from "react";
import axios from "axios";

function Reservas() {

  const [reservas, setReservas] = useState([]);

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";

  useEffect(() => {
    obtenerReservas();
  }, []);

  const obtenerReservas = async () => {

    try {

      const response = await axios.get(
        `${API_URL}/api/reservas`
      );

      setReservas(response.data);

    } catch (error) {

      console.error(error);
    }
  };

  // 💳 PAGAR
  const pagarReserva = async (reserva) => {

    try {

      const response = await axios.post(
        `${API_URL}/api/pago`,
        {
          titulo: `Reserva ${reserva.stand}`,
          precio: reserva.total_pagado
        }
      );

      if (
        response.data.success &&
        response.data.init_point
      ) {

        window.location.href =
          response.data.init_point;
      }

    } catch (error) {

      console.log(error);

      alert("Error al procesar pago");
    }
  };

  return (

    <div style={{ padding: "20px" }}>

      <h1
        style={{
          color: "#1e3a8a"
        }}
      >
        📋 Mis Reservas
      </h1>

      <table
        style={{
          width: "100%",
          backgroundColor: "white",
          borderCollapse: "collapse",
          marginTop: "20px",
          borderRadius: "12px",
          overflow: "hidden"
        }}
      >

        <thead>

          <tr>

            <th style={thStyle}>
              Expositor
            </th>

            <th style={thStyle}>
              Correo
            </th>

            <th style={thStyle}>
              Estado
            </th>

            <th style={thStyle}>
              Stand
            </th>

            <th style={thStyle}>
              Precio
            </th>

            <th style={thStyle}>
              Pago
            </th>

          </tr>

        </thead>

        <tbody>

          {
            reservas.map((reserva) => (

              <tr key={reserva.id_reserva}>

                {/* EXPOSITOR */}
                <td style={tdStyle}>
                  {reserva.nombre}
                </td>

                {/* CORREO */}
                <td style={tdStyle}>
                  {reserva.email}
                </td>

                {/* ESTADO */}
                <td style={tdStyle}>

                  <span
                    style={{
                      color:
                        reserva.estado_reserva ===
                        "confirmada"
                          ? "#eab308"
                          : "#22c55e",

                      fontWeight: "bold"
                    }}
                  >
                    ● {reserva.estado_reserva}
                  </span>

                </td>

                {/* STAND */}
                <td style={tdStyle}>
                  {reserva.stand}
                </td>

                {/* PRECIO */}
                <td style={tdStyle}>
                  ${reserva.total_pagado}
                </td>

                {/* PAGO */}
                <td style={tdStyle}>

                  <button
                    onClick={() =>
                      pagarReserva(reserva)
                    }
                    style={{
                      background: "#00B050",
                      color: "white",
                      border: "none",
                      padding: "10px 15px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                  >
                    💳 Pagar
                  </button>

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
  padding: "12px",
  backgroundColor: "#1e3a8a",
  color: "white",
  textAlign: "center"
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "12px",
  textAlign: "center"
};

export default Reservas;