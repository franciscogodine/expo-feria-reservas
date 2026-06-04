import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapStand({ stands }) {

  return (
    <MapContainer
      center={[19.4326, -99.1332]}
      zoom={15}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "10px"
      }}
    >

      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {stands.map((stand) => (

        <Marker
          key={stand.id_stand}
          position={[stand.latitud, stand.longitud]}
        >

          <Popup>
            <h3>{stand.nombre}</h3>

            <p>
              Estado: {stand.estado}
            </p>

            <p>
              Precio: ${stand.precio}
            </p>
          </Popup>

        </Marker>
      ))}

    </MapContainer>
  );
}

export default MapStand;