import React from 'react'
import InputItem from './InputItem'

function SearchSection() {
  console.log('search')
  return (
    <div className='p-2 md:p-6
    border-[2px] rounded-xl'>
        <p className='text-[20px] font-bold'>Сделать заказ</p>
        
        <InputItem type='source' />
        <InputItem type='destination' />

        <button className='p-3 bg-black w-full mt-5
        text-white rounded-lg'>Поиск авто</button>
    </div>
  )
}

export default SearchSection