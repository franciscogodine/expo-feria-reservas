import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import ReservationModal from "./ReservationModal";

function StandMap({ stands }) {
  const [selectedStand, setSelectedStand] = useState(null);

  const getColor = (estado) => {
    if (estado === 'disponible') return '#22c55e';
    if (estado === 'reservado') return '#eab308';
    return '#ef4444';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '15px', color: '#1e3a8a' }}>
        🗺️ Plano Interactivo - Expo Feria 2026
      </h2>

      <MapContainer 
        center={[19.52, -99.08]} 
        zoom={15} 
        style={{ height: '700px', width: '100%', borderRadius: '12px', border: '3px solid #ddd' }}
      >
        {/* Vista Satélite */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; Esri'
        />

        {stands.map((stand) => {
          // Posición más precisa y aleatoria controlada
          const lat = 19.52 + (Math.random() - 0.5) * 0.05;
          const lng = -99.08 + (Math.random() - 0.5) * 0.05;

          return (
            <CircleMarker
              key={stand.id_stand}
              center={[lat, lng]}
              radius={12}                    // Tamaño del círculo
              pathOptions={{
                color: getColor(stand.estado),
                fillColor: getColor(stand.estado),
                fillOpacity: 0.9,
                weight: 4
              }}
            >
              <Popup>
                <div style={{ minWidth: '240px', textAlign: 'center' }}>
                  <strong style={{ fontSize: '17px' }}>{stand.nombre}</strong><br />
                  Código: <strong>{stand.codigo}</strong><br />
                  Tipo: {stand.tipo}<br />
                  Zona: {stand.zona}<br />
                  Dimensión: {stand.dimension}<br />
                  Precio: <strong style={{ color: '#1e3a8a', fontSize: '18px' }}>${stand.precio}</strong><br /><br />
                  
                  <span style={{ 
                    color: getColor(stand.estado), 
                    fontWeight: 'bold', 
                    fontSize: '16px' 
                  }}>
                    ● {stand.estado.toUpperCase()}
                  </span><br /><br />

                  {stand.estado === 'disponible' ? (
                    <button 
                      onClick={() => setSelectedStand(stand)}
                      style={{
                        width: '100%',
                        padding: '14px',
                        backgroundColor: '#1e3a8a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        cursor: 'pointer'
                      }}
                    >
                      Reservar Este Stand
                    </button>
                  ) : (
                    <p style={{ color: 'red', fontWeight: 'bold' }}>No disponible</p>
                  )}
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