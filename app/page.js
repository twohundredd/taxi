'use client'
import SearchSection from "@/components/Home/SearchSection";
// import Map from "../components/Map/Map";
// import Image from "next/image";
// import { useMemo } from "react";
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('@/components/Map/Map'), {
  ssr: false,
})
export default function Home() {
  // const Map = useMemo(() => dynamic(
  //   () => import('../components/Map/Map'),
  //   { 
  //     loading: () => <p>A map is loading</p>,
  //     ssr: false
  //   }
  // ), [])
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5 relative">
      <div className="absolute">
        <SearchSection />
      </div>
      <div className="col-span-2 realative" id='map'>
        <Map />
      </div>
    </div>
  )
}