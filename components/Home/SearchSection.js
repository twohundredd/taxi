import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { useSelectPosition } from '../Context';
import ListItemButton from '@mui/material/ListItemButton'; // Добавлен импорт
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

const SearchSection = () => {
  const { setSelectPosition } = useSelectPosition();
  const [searchText, setSearchText] = useState('');
  const [listPlace, setListPlace] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setError(null);
    try {
      const params = {
        q: searchText,
        format: 'json',
        addressdetails: 1,
        polygon_geojson: 0,
      };
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${NOMINATIM_BASE_URL}${queryString}`);
      if (!response.ok) {
        const errorData = await response.json(); // Try parsing error response
        const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setListPlace(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSelectLocation = useCallback((item) => {
    console.log("handleSelectLocation - BEFORE setSelectPosition:", item);
    if (item && item.lat && item.lon) {
      setSelectPosition({ lat: parseFloat(item.lat), lon: parseFloat(item.lon) });
    }
    console.log("handleSelectLocation - AFTER setSelectPosition:", item);
  }, [setSelectPosition]);

  return (
    <div>
      <div className='p-2 md:p-6 rounded-xl'>
          
        {/* <p className='text-[20px] font-bold'>Сделать заказ</p> */}

        {/* <SearchBox type='source'
          value={searchText}
          onChange={(event) => {
              setSearchText(event.target.value);
          }}
        /> */}
        <div className='bg-white left-5 w-11/12 z-10 p-3 rounded-lg mt-3
            flex items-center gap-4'>
          <Image src='/destination.png'
            width={15} height={15} alt='' />

          <input type='text' className='bg-transparent w-full outline-none'
              placeholder='Текущий адрес'
              value={searchText}
              // value={searchTextDeparture}
              onChange={e => setSearchText(e.target.value)}
                  // setSearchTextDeparture(event.target.value);
              
          />
        </div>
        
        <div className='bg-white left-5 w-11/12 z-10 p-3 rounded-lg mt-3
            flex items-center gap-4'>
          <Image src='/source.png'
            width={15} height={15} alt='' />

          <input type='text' className='bg-transparent w-full outline-none'
              placeholder='Куда поедем?'
              value={searchText}
              // value={searchTextArrival}
              onChange={e => setSearchText(e.target.value)}
          />
        </div>
        
        {/* <SearchBox type='destination'
          value={searchText}
          onChange={(event) => {
              setSearchText(event.target.value);
          }}
        /> */}

        <button className='p-3 bg-black left-5 w-11/12 z-10 mt-5
        text-white rounded-lg' 
        onClick={handleSearch}>
          Поиск авто
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {listPlace.map((item, index) => (
          <li key={item?.osm_id || index}>
            <ListItemButton onClick={() => handleSelectLocation(item)}> {/* Здесь был ListItemButton */}
              <ListItemIcon>
                <img src='./finalMarker_map.png' alt='Final Marker' className='w-5 h-5' />
              </ListItemIcon>
              <ListItemText primary={item?.display_name} />
            </ListItemButton>
            <Divider />
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default SearchSection