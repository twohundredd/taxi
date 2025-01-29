import { MapProvider } from '@/components/MapContext';
import '@/app/global.css'

export default function App({ Component, pageProps }) {
    return (
    <MapProvider>
        <Component {...pageProps} />
        </MapProvider>
    )
}