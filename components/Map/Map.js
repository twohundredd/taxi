import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef } from "react";
const DynamicMap = dynamic(() => import('./DynamicMap'), {
  ssr: false
});

export function useIsFirstRender() {
    const renderRef = useRef(true);
  
    
    if (renderRef.current) {
      renderRef.current = false;
      return true;
    }
  
    return renderRef.current;
  }

  
  

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;

const Map = (props) => {
  const { width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT } = props;

  return (
    <div style={{ aspectRatio: width / height }}>
      <DynamicMap  />
    </div>
  )
}

export default Map;