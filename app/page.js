'use client'
import Map from "../components/Map/Map";
import SearchSection from '../components/Home/SearchSection';
import { useState, useEffect, createContext } from "react";
import io from 'socket.io-client';

const SelectPositionContext = createContext(null);
const socket = io("http://localhost:3001");


export default function Home() {
  const [selectPosition, setSelectPosition] = useState({});


  return (
      <div className="p-6 flex justify-center">
        <div className="relative z-0">
          <Map selectPosition={selectPosition} />
        </div>
        <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <SearchSection
          setSelectPosition={setSelectPosition}
          />
        </div>
      </div>
  )
}