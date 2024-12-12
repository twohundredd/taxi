import { MapContainer, Marker, TileLayer, Popup, useMap } from "react-leaflet";
import { useEffect, useRef, useMemo, useState } from 'react';
import "leaflet-defaulticon-compatibility";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import L from 'leaflet';

const icon = L.icon({ iconUrl: './myMarker_map.png', iconSize: [40, 40] });
const position = [53.214923906919594, 50.158586620166396];
const zoom = 13;

const ResetCenterView = ({ selectPosition }) => {
  const map = useMap();
  useEffect(() => {
    console.log('selectPosition in ResetCenterView:', selectPosition); //Check this
    if (selectPosition) {
      map.setView(L.latLng(parseFloat(selectPosition.lat), parseFloat(selectPosition.lon)), map.getZoom(), { animate: true });
    }
  }, [selectPosition, map]);
  return null;
};

const MapComponent = ({ selectPosition, setPosition }) => {
    const [map, setMap] = useState(null);
    const locationSelection = [parseFloat(selectPosition?.lat), parseFloat(selectPosition?.lon)];
    console.log('selectPosition FROM DynamicMap.js: ', selectPosition)
    const markerRef = useRef(null);

    const eventHandlers = useMemo(() => ({
        dragend() {
            const marker = markerRef.current;
            if (marker) {
                setPosition(marker.getLatLng());
            }
        },
    }), []);

    useEffect(() => {
        console.log("selectPosition in MapComponent", selectPosition);
    }, [selectPosition]);


    return (
        <MapContainer className={'w-full h-1/2 rounded-lg'} center={position} zoom={zoom} scrollWheelZoom={false} ref={el => setMap(el)}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            {selectPosition && (
                <Marker position={locationSelection}
                eventHandlers={eventHandlers} draggable ref={markerRef} icon={icon}>
                    <Popup>Вы здесь!</Popup>
                </Marker>
            )}
            {map && <ResetCenterView selectPosition={selectPosition} />}
        </MapContainer>
    );
};

export default MapComponent;