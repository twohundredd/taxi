// import React, { } from 'react'
import InputPlaces from '../ui/InputPlaces'
// import { Coords } from 'leaflet'

const FromInput = () => {
    const cbSuccess = (address, location) => {
        console.log('success', address, location);
    }

    return <InputPlaces cbSuccess={cbSuccess} type='from' />
}

export default FromInput;