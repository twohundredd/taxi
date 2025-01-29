'use client'; // This line is crucial
import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Downshift from 'downshift';

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

const SearchSection = ({ setSelectPosition }) => {
  const [searchText, setSearchText] = useState({ departure: '', arrival: '' });
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState({ departure: null, arrival: null });
  const [listPlace, setListPlace] = useState([]);
  const [error, setError] = useState(null);

  const handleSearchChange = useCallback(async (value, type) => {
    setSearchText((prev) => ({ ...prev, [type]: value }));
    if (value.length > 2) {
      const response = await fetch(`${NOMINATIM_BASE_URL}q=${encodeURIComponent(value)}&format=json&limit=5`);
      const data = await response.json();
      setSuggestions(data);
    } else {
      setSuggestions([]);
    }
  }, []);

  const handleSearch = useCallback(async (type) => {
    setError(null);
    try {
      const params = {
        q: searchText[type],
        format: 'json',
        addressdetails: 1,
        polygon_geojson: 0,
      };
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${NOMINATIM_BASE_URL}${queryString}`);
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setListPlace(data);
    } catch (error) {
      setError(error.message);
    }
  }, [searchText]);

  const handleSelectLocation = useCallback((item, type) => {
    setSelectedLocations((prev) => ({ ...prev, [type]: item }));
    setSearchText((prev) => ({ ...prev, [type]: item.display_name }));
  }, []);

  const handleUpdatePosition = useCallback(() => {
    if (selectedLocations.departure && selectedLocations.departure.lat && selectedLocations.departure.lon &&
      selectedLocations.arrival && selectedLocations.arrival.lat && selectedLocations.arrival.lon) {
      setSelectPosition({
        departure: {
          lat: parseFloat(selectedLocations.departure.lat),
          lon: parseFloat(selectedLocations.departure.lon)
        },
        arrival: {
          lat: parseFloat(selectedLocations.arrival.lat),
          lon: parseFloat(selectedLocations.arrival.lon)
        }
      });
    }
  }, [selectedLocations, setSelectPosition]);

  return (
    <div>
      <div className='p-2 md:p-6 rounded-xl'>
        <Downshift onChange={item => handleSelectLocation(item, 'departure')}>
          {({ getInputProps, getItemProps, isOpen, highlightedIndex, suggestions }) => (
            <div>
              <div className='bg-white left-5 w-11/12 z-10 p-3 rounded-lg mt-3 flex items-center gap-4'>
                <Image src='/destination.png' width={15} height={15} alt='' />
                <input {...getInputProps({ placeholder: 'Текущая позиция', onChange: (e) => handleSearchChange(e.target.value, 'departure') })} />
              </div>
              {isOpen && (
                <ul>
                  {suggestions.map((item, index) => (
                    <li
                      style={{ backgroundColor: highlightedIndex === index ? 'lightgray' : 'white' }}
                      {...getItemProps({ item, index })}
                      key={item.osm_id}
                      onClick={() => handleSelectLocation(item, 'departure')}
                    >
                      {item.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </Downshift>
        <Downshift onChange={item => handleSelectLocation(item, 'arrival')}>
          {({ getInputProps, getItemProps, isOpen, highlightedIndex, suggestions }) => (
            <div>
              <div className='bg-white left-5 w-11/12 z-10 p-3 rounded-lg mt-3 flex items-center gap-4'>
                <Image src='/source.png' width={15} height={15} alt='' />
                <input {...getInputProps({ placeholder: 'Куда поедем?', onChange: (e) => handleSearchChange(e.target.value, 'arrival') })} />
              </div>
              {isOpen && (
                <ul>
                  {suggestions.map((item, index) => (
                    <li
                      style={{ backgroundColor: highlightedIndex === index ? 'lightgray' : 'white' }}
                      {...getItemProps({ item, index })}
                      key={item.osm_id}
                      onClick={() => handleSelectLocation(item, 'arrival')}
                    >
                      {item.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </Downshift>

        <button className='p-3 bg-black left-5 w-11/12 z-10 mt-5 text-white rounded-lg' onClick={() => handleSearch('departure')}>
          Поиск отправления
        </button>
        <button className='p-3 bg-black left-5 w-11/12 z-10 mt-5 text-white rounded-lg' onClick={() => handleSearch('arrival')}>
          Поиск прибытия
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={handleUpdatePosition}>Обновить карту</button>
      </div>
    </div>
  );
};

export default SearchSection;
