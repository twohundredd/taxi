import React, { useState } from 'react'
import Image from 'next/image'


export default function SearchBox({type}) {
    const [searchText, setSearchText] = useState("");
    return (
        <div className='bg-slate-200 p-3 rounded-lg mt-3
            flex items-center gap-4'>

            <Image src={type == 'source'?'/source.png':'/destination.png'}
                width={15} height={15} alt='' />

            <input type='text' className='bg-transparent w-full outline-none'
                placeholder={type == 'source'?'Текущий адрес':'Куда поедем?'}
                value={searchText}
                onChange={(event) => {
                    setSearchText(event.target.value);
                }}
            />
            
        </div>
    )
}