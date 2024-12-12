import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";

const DynamicMap = dynamic(() => import('./DynamicMap'), { ssr: false, loading: () => <p>A map is loading</p> });

export const useIsFirstRender = () => {
  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => setIsFirstRender(false), []);
  return isFirstRender;
};

const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 1200;

const Map = ({ width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT }) => {
  return (
    <div className="map-container" style={{ width: `${width}px`, height: `${height}px` }}>
      <DynamicMap />
    </div>
  );
};

export default Map;