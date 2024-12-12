'use client'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'
const headerMenu =
[
    {
        id: 1,
        name: 'Такси',
        icon: '/icon-goon-taxi.png'
    },
    {
        id: 2,
        name: 'Доставка',
        icon: '/box.png'
    }
]
export default function Header() {

    return (
        <div className='p-5 pb-3 pl-10 border-b-[4px]
        border-gray-200 flex items-center justify-between'>
            <div className='flex gap-24 items-center'>
                <Image src='/goon-logo.png'
                width={70} height={70}
                alt='Logo' />
                <div className='flex g-6 items-center'>
                    {headerMenu.map((item, idx) => (
                        <div key={idx} className='flex gap-2 items-center'>
                            <Image src={item.icon}
                            width={20} height={20} alt='' />
                            <h2 className='text-[14px] font-medium'>{item.name}</h2>
                        </div>
                    ))}
                </div>
            </div>
            <UserButton />
        </div>
    )
}