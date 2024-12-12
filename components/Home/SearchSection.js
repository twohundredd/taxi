import React, { useState } from 'react'
import Image from 'next/image'
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useSelectPosition } from '../Context'; // Импорт хука

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

const SearchSection = () => {
  const { selectPosition, setSelectPosition } = useSelectPosition();
  console.log('This selectPosition Date: ', selectPosition);
  // const [searchTextDeparture, setSearchTextDeparture,
  //       searchTextArrival, setSearchTextArrival ] = useState("");
  const [searchText, setSearchText] = useState("");
  const [listPlace, setListPlace] = useState([]);
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
              onChange={(event) => {
                  setSearchText(event.target.value);
                  // setSearchTextDeparture(event.target.value);
              }}
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
              onChange={(event) => {
                setSearchText(event.target.value);
                // setSearchTextArrival(event.target.value);
              }}
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
          onClick={() => {
          // Search
          const params = {
              q: searchText,
              format: 'json',
              addressdetails: 1,
              polygon_geojson: 0
          };
          const queryString = new URLSearchParams(params).toString();
          const requestOptions = {
              method: "GET",
              redirect: "follow"
          };
          fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
              .then((response) => response.text())
              .then((result) => {
                  console.log(JSON.parse(result));
                  setListPlace(JSON.parse(result));
              })
              .catch((err) => console.log("err: ", err));
          }}>
          Поиск авто
        </button>
      </div>
      <div>
        
        <nav aria-label="main mailbox folders">
          {listPlace.map((item) => {
            return (
              <div key={item?.osm_id || index}>
                <ListItemButton onClick={() => {
                  setSelectPosition(item);
                  // console.log(setSelectPosition(item));
                }}>
                  <ListItemIcon>
                    <img src='./finalMarker_map.png'
                      alt='Final Marker'
                      className='w-5 h-5'
                    />
                  </ListItemIcon>
                  <ListItemText primary={item?.display_name} />
                </ListItemButton>
                <Divider />
              </div>
            );
          })}
        </nav>

      </div>
    </div>
  );
}

export default SearchSection