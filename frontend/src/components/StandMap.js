import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import axios from "axios";
import ReservationModal from "./ReservationModal";

function StandMap({ stands, onRefresh }) {
  const [selectedStand, setSelectedStand] = useState(null);

  const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000";

  const getColor = (estado) => {
    if (estado === "disponible") return "#22c55e";
    if (estado === "reservado") return "#eab308";
    return "#ef4444";
  };

  // 🔓 liberar stand (ADMIN)
  const liberarStand = (id) => {
    axios
      .put(`${API_URL}/api/stands/liberar/${id}`)
      .then(() => {
        if (onRefresh) onRefresh();
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#1e3a8a" }}>
        🗺️ Mapa de Stands
      </h2>

      <MapContainer
        center={[19.52, -99.08]}
        zoom={15}
        style={{
          height: "700px",
          width: "100%",
          borderRadius: "12px",
          border: "2px solid #ddd",
        }}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; Esri"
        />

        {stands.map((stand) => {
          // ✅ USO REAL DE BD (NO RANDOM)
          const lat = stand.latitud;
          const lng = stand.longitud;

          if (!lat || !lng) return null;

          return (
            <CircleMarker
              key={stand.id_stand}
              center={[lat, lng]}
              radius={12}
              pathOptions={{
                color: getColor(stand.estado),
                fillColor: getColor(stand.estado),
                fillOpacity: 0.9,
                weight: 3,
              }}
            >
              <Popup>
                <div style={{ minWidth: "240px" }}>
                  <h3>{stand.nombre}</h3>

                  <p>
                    <b>Código:</b> {stand.codigo}
                  </p>
                  <p>
                    <b>Tipo:</b> {stand.tipo}
                  </p>
                  <p>
                    <b>Zona:</b> {stand.zona}
                  </p>
                  <p>
                    <b>Precio:</b> ${stand.precio}
                  </p>

                  <p
                    style={{
                      color: getColor(stand.estado),
                      fontWeight: "bold",
                    }}
                  >
                    ● {stand.estado}
                  </p>

                  {/* RESERVA */}
                  {stand.estado === "disponible" && (
                    <button
                      onClick={() => setSelectedStand(stand)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        background: "#1e3a8a",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Reservar
                    </button>
                  )}

                  {/* ADMIN CONTROL */}
                  <button
                    onClick={() => liberarStand(stand.id_stand)}
                    style={{
                      width: "100%",
                      marginTop: "8px",
                      padding: "8px",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Liberar (Admin)
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <ReservationModal
        stand={selectedStand}
        onClose={() => setSelectedStand(null)}
      />
    </div>
  );
}

export default StandMap;