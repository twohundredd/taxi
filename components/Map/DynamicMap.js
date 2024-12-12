import { MapContainer, Marker, TileLayer, Popup, useMap } from "react-leaflet";
import { useEffect, useRef, useMemo, useState } from 'react';
import "leaflet-defaulticon-compatibility";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import L from 'leaflet';

const icon = L.icon({ iconUrl: './myMarker_map.png', iconSize: [40, 40] });
const position = [53.214923906919594, 50.158586620166396];
const zoom = 13;

const MapComponent = ({ selectPosition }) => {
  console.log("MapComponent - selectPosition:", selectPosition);
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);

  // const locationSelection = selectPosition && [
  //   Number.isNaN(parseFloat(selectPosition.lat)) ? 0 : parseFloat(selectPosition.lat), // Проверка на NaN
  //   Number.isNaN(parseFloat(selectPosition.lon)) ? 0 : parseFloat(selectPosition.lon), // Проверка на NaN
  // ];

  const locationSelection = useMemo(() => {
    if (selectPosition) {
      return [parseFloat(selectPosition.lat), parseFloat(selectPosition.lon)];
    }
    return null;
  }, [selectPosition]);

  const markerRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    const updateMapView = () => {
      const lat = parseFloat(selectPosition?.lat) || 0;
      const lon = parseFloat(selectPosition?.lon) || 0;

      if (lat && lon) {
        map.setView([lat, lon], map.getZoom());
        mapRef.current = map; //Store map object
      }
    };

    updateMapView(); //Call updateMapView after component mount
  }, [selectPosition, map]);

  return (
    <MapContainer className={'w-full h-1/2 rounded-lg'} center={position} zoom={zoom} scrollWheelZoom={false} ref={setMap}>
      <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
      {selectPosition && (
        <Marker position={locationSelection} ref={markerRef} icon={icon}>
          <Popup>Вы здесь!</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;