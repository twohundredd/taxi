import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet"
// import "leaflet-defaulticon-compatibility"
import "leaflet/dist/leaflet.css"
// import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"


export default function Map() {
  // const { position, zoom } = [51.505, -0.09], 13
  const position = [51.505, -0.09]
  console.log('map here')
  return (
    <MapContainer className={'w-screen h-screen'} center={position} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
      <Marker position={position}>
        <Popup>
          Вы здесь!
        </Popup>
      </Marker>
    </MapContainer>
  )
}

