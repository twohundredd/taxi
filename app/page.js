'use client'
import SearchSection from "@/components/Home/SearchSection";
import Map from "../components/Map/Map";


export default function Home() {

  console.log('render')
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