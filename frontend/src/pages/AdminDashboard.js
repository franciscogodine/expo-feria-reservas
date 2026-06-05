import { useEffect, useState } from "react";
import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

function AdminDashboard() {

  // =========================
  // USUARIO LOGUEADO
  // =========================
  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  const [stands, setStands] = useState([]);

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";

  // =========================
  // PROTEGER RUTA ADMIN
  // =========================
  useEffect(() => {

    if (
      !usuario ||
      usuario.tipo_usuario !== "admin"
    ) {

      window.location.href = "/login";
    }

  }, []);

  // =========================
  // OBTENER STANDS
  // =========================
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

  useEffect(() => {

    obtenerStands();

  }, []);

  // =========================
  // ESTADISTICAS
  // =========================
  const disponibles =
    stands.filter(
      s => s.estado === "disponible"
    ).length;

  const reservados =
    stands.filter(
      s => s.estado === "reservado"
    ).length;

  const ocupados =
    stands.filter(
      s => s.estado === "ocupado"
    ).length;

  const data = [
    {
      name: "Disponibles",
      value: disponibles
    },
    {
      name: "Reservados",
      value: reservados
    },
    {
      name: "Ocupados",
      value: ocupados
    },
  ];

  const COLORS = [
    "#22c55e",
    "#eab308",
    "#ef4444"
  ];

  // =========================
  // CAMBIAR ESTADO
  // =========================
  const cambiarEstado = async (
    id,
    estado
  ) => {

    try {

      await axios.put(
        `${API_URL}/api/stands/${id}/estado`,
        { estado }
      );

      obtenerStands();

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#f5f7fb",
        minHeight: "100vh"
      }}
    >

      <h1
        style={{
          color: "#1e3a8a",
          marginBottom: "30px"
        }}
      >
        👨‍💼 Dashboard Administrador
      </h1>

      {/* TARJETAS */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "40px",
          flexWrap: "wrap"
        }}
      >

        <div style={card}>
          <h3>🟢 Disponibles</h3>
          <h1>{disponibles}</h1>
        </div>

        <div style={card}>
          <h3>🟡 Reservados</h3>
          <h1>{reservados}</h1>
        </div>

        <div style={card}>
          <h3>🔴 Ocupados</h3>
          <h1>{ocupados}</h1>
        </div>

      </div>

      {/* GRAFICA */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "40px",
          width: "fit-content",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)"
        }}
      >

        <h2>
          📊 Estadísticas de Ocupación
        </h2>

        <PieChart width={450} height={400}>

          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={130}
            dataKey="value"
            label
          >

            {
              data.map((entry, index) => (

                <Cell
                  key={index}
                  fill={COLORS[index]}
                />

              ))
            }

          </Pie>

          <Tooltip />
          <Legend />

        </PieChart>

      </div>

      {/* TABLA */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)"
        }}
      >

        <h2>
          🛠️ Administrar Stands
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse"
          }}
        >

          <thead>

            <tr>

              <th style={th}>
                Código
              </th>

              <th style={th}>
                Nombre
              </th>

              <th style={th}>
                Estado
              </th>

              <th style={th}>
                Acciones
              </th>

            </tr>

          </thead>

          <tbody>

            {
              stands.map((stand) => (

                <tr key={stand.id_stand}>

                  <td style={td}>
                    {stand.codigo}
                  </td>

                  <td style={td}>
                    {stand.nombre}
                  </td>

                  <td style={td}>

                    <span
                      style={{
                        color:
                          stand.estado === "disponible"
                            ? "#22c55e"
                            : stand.estado === "reservado"
                            ? "#eab308"
                            : "#ef4444",

                        fontWeight: "bold"
                      }}
                    >
                      ● {stand.estado}
                    </span>

                  </td>

                  <td style={td}>

                    <button
                      style={greenBtn}
                      onClick={() =>
                        cambiarEstado(
                          stand.id_stand,
                          "disponible"
                        )
                      }
                    >
                      Habilitar
                    </button>

                    <button
                      style={yellowBtn}
                      onClick={() =>
                        cambiarEstado(
                          stand.id_stand,
                          "reservado"
                        )
                      }
                    >
                      Reservar
                    </button>

                    <button
                      style={redBtn}
                      onClick={() =>
                        cambiarEstado(
                          stand.id_stand,
                          "ocupado"
                        )
                      }
                    >
                      Ocupar
                    </button>

                  </td>

                </tr>

              ))
            }

          </tbody>

        </table>

      </div>

    </div>
  );
}

// =========================
// ESTILOS
// =========================

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  width: "220px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};

const th = {
  border: "1px solid #ddd",
  padding: "12px",
  background: "#1e3a8a",
  color: "white"
};

const td = {
  border: "1px solid #ddd",
  padding: "12px"
};

const greenBtn = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "8px"
};

const yellowBtn = {
  background: "#eab308",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "8px"
};

const redBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer"
};

export default AdminDashboard;