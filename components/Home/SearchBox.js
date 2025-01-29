import React, { useState } from 'react'
import Image from 'next/image'


export default function SearchBox({type, value, onChange}) {
    const [searchText, setSearchText] = useState({ departure: "", arrival: "" });
    return (
        <div className='bg-white left-5 w-11/12 z-10 p-3 rounded-lg mt-3
        flex items-center gap-4'>

            <Image src={type === 'source'?'/source.png':'/destination.png'}
                width={15} height={15} alt='' />

            <input type='text' className='bg-transparent w-full outline-none'
                placeholder={type === 'source'?'Текущий адрес!!':'Куда поедем??'}
                value={ type === 'source' ? searchText.departure : searchText.arrival }
                // onChange={(event) => {
                //     setSearchText(prevState => ({
                //         ...prevState,
                //         [type === 'source' ? 'departure' : 'arrival']: event.target.value
                //     }));
                // }}
                // onChange={(e) => setSearchText((prev) => ({...prev, [type === 'source' ? 'departure' : 'arrival']: e.target.value }))}
            />
            
        </div>
    )
}