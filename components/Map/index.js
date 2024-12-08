// import dynamic from 'next/dynamic';

// const Map = dynamic(() => import('./Map'), {
//     ssr: false
// })

// export default Map

import dynamic from 'next/dynamic'
// const Map = dynamic(() => import('../Map/Map').then(mad => mad.Map), {
//     ssr: false,
// })
const index = () => {
    return (
    <>
        <h1 className='text-center'>OpenStreetMap</h1>
        {/* <Map /> */}
    </>
    )
}
export default index