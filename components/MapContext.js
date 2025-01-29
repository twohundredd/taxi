import React, { createContext, useState, useContext, useRef } from 'react';

const MapContext = createContext();

export const MapProvider = ({ children }) => {
    const [selectPosition, setSelectPosition] = useState({});
    const markersRef = useRef([]);

    const updateMarker = (newMarker) => {
    markersRef.current = [...markersRef.current, newMarker]
    }

    const value = {
    selectPosition,
    setSelectPosition,
        markersRef,
    updateMarker
    };

    return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const useMap = () => useContext(MapContext);