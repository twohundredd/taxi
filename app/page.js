'use client'
import Map from "../components/Map/Map";
import SearchSection from '../components/Home/SearchSection';
import { useState } from "react";
import { SelectPositionProvider } from '../components/Context'; 


export default function Home() {
  const [selectPosition, setSelectPosition] = useState(null);
  console.log('selectPosition FROM page.js: ', selectPosition);

  return (
    <SelectPositionProvider>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="relative col-span-2 z-0">
          <Map selectPosition={selectPosition} setPosition={setSelectPosition} />
        </div>
        <div className="absolute bottom-60 rounded-xl">
          <SearchSection />
        </div>
      </div>
    </SelectPositionProvider>
  )
}
