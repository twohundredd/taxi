import { MapContainer, Marker, TileLayer, Popup, Circle } from "react-leaflet";
import { useEffect, useRef, useMemo, useState } from 'react';
import "leaflet-defaulticon-compatibility";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import L from 'leaflet';
import "leaflet-routing-machine";

const driverIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -20]
});

const position = [53.214923906919594, 50.158586620166396];
const zoom = 13;

const MapComponent = ({ selectPosition, userPosition }) => {
  
  // Current location
  const [driverLocation, setDriverLocation] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  // Current location end

  const [map, setMap] = useState(null);

  const markerRef = useRef(null);
  const mapRef = useRef();

  const popupRef = useRef(null);

  const getWaypoints = () => {
    const waypoints = [];

    if(selectPosition?.departure) {
      waypoints.push(L.latLng(selectPosition.departure.lat, selectPosition.departure.lon));
    }
    if(selectPosition?.arrival) {
      waypoints.push(L.latLng(selectPosition.arrival.lat, selectPosition.arrival.lon));
    }
    if(userPosition?.departure) {
      waypoints.push(L.latLng(userPosition.departure.lat, userPosition.departure.lon));
    }
    if(userPosition?.arrival) {
      waypoints.push(L.latLng(userPosition.arrival.lat, userPosition.arrival.lon));
    }
    return waypoints;
  };


  useEffect(() => {
    if (!map) return;
    
    const updateMapView = () => {
      
      const waypoints = getWaypoints();

      if (waypoints.length === 0) {
        // map.setView([lat, lon], map.getZoom());
        map.setView(position, zoom);
      }
    };
    
    updateMapView();
  }, [selectPosition, userPosition, map]);

  const routingControlRef = useRef(null);
  const routeInfoRef = useRef(null);

  useEffect(() => {
    console.log('selectPosition in MapComponent:', selectPosition)
    console.log('userPosition in MapComponent:', userPosition)

    const map = mapRef.current;

    if (!map) return;

    const waypoints = getWaypoints();
    
    if (waypoints.length < 2) {
      if(routingControlRef.current) {
        map.removeControl(routingControlRef.current)
        routingControlRef.current = null
      }
      if(popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }        
      return
    }
    if(routingControlRef.current) {
      map.removeControl(routingControlRef.current)
    }

    const routingControl = L.Routing.control({
      waypoints: waypoints,
      lineOptions: {
        styles: [{ color: "green", opacity: 0.6, weight: 5 }]
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false
    })

    const onHandleFound = (e) => {
      if (e.routes && e.routes.length > 0) {
        const route = e.routes[0];
        const totalDistance = route.summary.totalDistance;
        const totalTime = route.summary.totalTime;

        const formattedDistance = (totalDistance / 1000).toFixed(2);

        let formattedTime = '';
        const totalMinutes = Math.floor(totalTime / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);
        const minutes = totalMinutes % 60;
        const hours = totalHours % 24;

        if(totalDays > 0) {
          formattedTime = `${totalDays} д ${hours} ч ${minutes} мин`;
        } else if(totalHours > 0) {
          formattedTime = `${hours} ч ${minutes} мин`;
        } else {
          formattedTime = `${minutes} мин`;
        }

        const midPoint = L.latLng(route.coordinates[Math.floor(route.coordinates.length/2)]);

        if(!popupRef.current) {
          popupRef.current = L.popup({
            closeButton: false,
            autoClose: false,
            closeOnClick: false,
            className: 'custom-popup pointer-events-none'
          }).setLatLng(midPoint).addTo(map);
        } else {
          popupRef.current.setLatLng(midPoint)
        }

        const content = `
          <div>
            <p><b>Расстояние:</b> ${formattedDistance} км</p>
            <p><b>Время в пути:</b> ${formattedTime}</p>
          </div>
        `;
        if (popupRef.current) {
          popupRef.current.setContent(content);
        }
      } else {
        if(popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      }
    };

    routingControl.on('routesfound', onHandleFound);
    routingControl.addTo(map);
    routingControlRef.current = routingControl;

    return () => {
      routingControl.off('routesfound', onHandleFound)
      map.removeControl(routingControl);
    };
  }, [selectPosition, userPosition]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const waypoints = getWaypoints();
    if (waypoints.length > 0) {
      const bounds = L.latLngBounds(waypoints);
      map.fitBounds(bounds);
    } else {
      map.setView(position, zoom);
    }
  }, [selectPosition, userPosition]);

  // Current location
  useEffect(() => {
    if(!mapRef.current) return;

    const map = mapRef.current;
    let watchId;

    const handleGeolocationSuccess = (pos) => {
      
      const { latitude, longitude } = pos.coords
      // console.log('pos.coords.accuracy:', pos.coords.accuracy)
      const accuracy = Math.floor(pos.coords.accuracy/300) // РАЗМЕР КРУГА

      setDriverLocation([latitude, longitude]);
      setAccuracy(accuracy);

      if(!driverLocation) {
        map.setView([latitude, longitude], zoom);
      }
    };

    const handleGeolocationError = (err) => {
      console.error('Ошибка геолокации:', err.message);
      alert('Для работы приложения разрешите доступ к геолокации в настройках браузера');
      // Можно показать уведомление для пользователя
    };

    if(navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        handleGeolocationSuccess,
        handleGeolocationError,
        {
          enableHighAccuracy: true,
        }
      );
    }
    // Очистка при размонтировании
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [mapRef.current, driverLocation]);
  // Current location end


  return (
    <MapContainer className={'w-full h-1/2 rounded-lg'} center={position} zoom={zoom} scrollWheelZoom={false} ref={mapRef} whenReady={() => console.log("Map ready!")} >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />


      {/* Маркер водителя */}
      {driverLocation && (
        <Marker 
          position={driverLocation}
          icon={new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            iconSize: [20, 36],
            iconAnchor: [12, 41],
            popupAnchor: [0, -20]
          })}>
          <Popup>Ваше местоположение</Popup>
        </Marker>
      )}

      {/* Круг точности */}
      {driverLocation && accuracy && (
        <Circle
          center={driverLocation}
          radius={accuracy}
          pathOptions={{
            color: 'white',
            fillColor: '#03f',
            fillOpacity: 0.3
          }}
        />
      )}


      {selectPosition?.departure && selectPosition.departure.lat && selectPosition.departure.lon && (
        <Marker position={[selectPosition.departure.lat, selectPosition.departure.lon]} ref={markerRef}>
          <Popup>Отправление</Popup>
        </Marker>
      )}
      {selectPosition?.arrival && selectPosition.arrival.lat && selectPosition.arrival.lon && (
        <Marker position={[selectPosition.arrival.lat, selectPosition.arrival.lon]} ref={markerRef}>
          <Popup>Прибытие</Popup>
        </Marker>
      )}

      {userPosition?.departure && userPosition.departure.lat && userPosition.departure.lon && (
        <Marker position={[userPosition.departure.lat, userPosition.departure.lon]} ref={markerRef}>
          <Popup>Отправление</Popup>
        </Marker>
      )}
      {userPosition?.arrival && userPosition.arrival.lat && userPosition.arrival.lon && (
        <Marker position={[userPosition.arrival.lat, userPosition.arrival.lon]} ref={markerRef}>
          <Popup>Прибытие</Popup>
        </Marker>
      )}

    </MapContainer>
  );
};

export default MapComponent;