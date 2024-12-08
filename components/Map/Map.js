import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet"
import "leaflet-defaulticon-compatibility"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

export default function Map() {
  // const { position, zoom } = [51.505, -0.09], 13
  const position = [51.505, -0.09]

  return (
    <MapContainer className={'w-screen h-screen'} center={position} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          Вы здесь!
        </Popup>
      </Marker>
    </MapContainer>
  )
}