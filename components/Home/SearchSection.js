import React, { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io("http://localhost:3001");

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

const SearchSection = ({ setSelectPosition }) => {
  const [searchText, setSearchText] = useState({ departure: '', arrival: '' });
  const [selectedLocations, setSelectedLocations] = useState({ departure: null, arrival: null });

  const [showSuggestions, setShowSuggestions] = useState({ departure: false, arrival: false });

  const inputRef = useRef({ departure: null, arrival: null });
  const suggestionsRef = useRef({ departure: null, arrival: null });

  const isMarkersSet = selectedLocations.departure && selectedLocations.arrival;

  const [suggestions, setSuggestions] = useState({
    departure: [],
    arrival: []
  });

  const [isFocused, setIsFocused] = useState({
    departure: false,
    arrival: false
  });

  const [selectedTariff, setSelectedTariff] = useState(null)

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState(null);

  const [driverAccepted, setDriverAccepted] = useState(false);
  const [driverArrived, setDriverArrived] = useState(false);
  const [orderSent, setOrderSent] = useState(false);


  const handleBlur = (inputType) => {
    setIsFocused((prev) => ({
      ...prev,
    [inputType]: false
    }));
    setShowSuggestions(prev => ({...prev, [inputType]: false})); // Скрываем предложения
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      let clickedOutside = true;
      if(inputRef.current) {
        for(let type in inputRef.current) {
          if(inputRef.current[type]?.contains(event.target)) {
            clickedOutside = false;
            break;
          }
        }
      }
      if(suggestionsRef.current) {
        for(let type in suggestionsRef.current) {
          if(suggestionsRef.current[type]?.contains(event.target)) {
            clickedOutside = false;
            break;
          }
        }
      }
      if(clickedOutside) {
        Object.keys(isFocused).forEach(type => {
          handleBlur(type);
        })
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleBlur, isFocused, suggestions]);

  const handleFocus = (inputType) => {
    setIsFocused((prev) => ({
      ...prev,
      [inputType]: true,
    }));
    setShowSuggestions(prev => ({...prev, [inputType]: true})); // Показываем предложения
    window.scrollTo(0, 0);
  };

  const FETCH_DELAY = 1001;
  let lastFetchTime = 0;

  const fetchSuggestions = useCallback(async (input, type) => {
    if (!input || !input.trim()) {
        setSuggestions((prev) => ({ ...prev, [type]: [] }));
        return;
    }

    const now = Date.now();
    if(now - lastFetchTime < FETCH_DELAY) {
      return
    }
    
    try {
      const response = await axios.get(NOMINATIM_BASE_URL, {
        params: {
            q: input,
            format: 'json',
            addressdetails: 1,
            limit: 5
        }
    });
    setSuggestions((prev) => ({ ...prev, [type]: response.data, }));
    lastFetchTime = now;
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError(err.message);
    }
  }, []);

  const handleSelectLocation = useCallback((item, type) => {
    // const { address } = item;

    // const city = address?.city || '';
    // const road = address.road ? address.road.replace('улица', 'ул.') : '';
    // const house_number = address?.house_number || '';

    let displayName = item.display_name;
    displayName = displayName
      .replace(/(^|\s)улица(\s|[,.])/gi, ' ул. ')
      .replace(/(^|\s)проспект(\s|[,.])/gi, ' пр-кт ')
      .replace(/(^|\s)шоссе(\s|[,.])/gi, ' ш. ')
      .replace(/(^|\s)съезд(\s|[,.])/gi, ' сзд. ')
      .replace(/(^|\s)проезд(\s|[,.])/gi, ' пр-д ')
      .replace(/(^|\s)площадь(\s|[,.])/gi, ' пл. ')
      .replace(/(^|\s)переулок(\s|[,.])/gi, ' пер. ')
      .replace(/(^|\s)магистраль(\s|[,.])/gi, ' мгстр. ')
      .replace(/(^|\s)километр(\s|[,.])/gi, ' км ')
      .replace(/(^|\s)бульвар(\s|[,.])/gi, ' б-р ')
      .replace(/(^|\s)район(\s|[,.])/gi, ' р-н ')
      .replace(/(^|\s)пос[её]лок(\s|[,.])/gi, ' п. ')
      .replace(/(^|\s)село(\s|[,.])/gi, ' с. ')
      .replace(/(^|\s)деревня(\s|[,.])/gi, ' д. ')
      .replace(/(^|\s)микрорайон(\s|[,.])/gi, ' мкр. ')
      .replace(/(^|\s)квартал(\s|[,.])/gi, ' кв-л ')
      .replace(/(^|\s)железнодорожн(?:ый|ая|ое|ые)(\s|[,.])/gi, ' ж/д ')
      .replace(/(^|\s)городское поселение(\s|[,.])/gi, ' г.п. ')
      .replace(/(^|\s)сельское поселение(\s|[,.])/gi, ' с.п. ')
      .replace(/(^|\s)городской пос[её]лок(\s|[,.])/gi, ' гп. ')
      .replace(/(^|\s)пос[её]лок городского типа(\s|[,.])/gi, ' пгт. ')
      .replace(/(^|\s)Сельсовет(\s|[,.])/gi, ' с/с ')
      .replace(/(^|\s)городской округ(\s|[,.])/gi, ' г.о. ')
      .replace(/(^|\s)муниципальный район(\s|[,.])/gi, ' м.р-н ')
      .replace(/(^|\s)республика(\s|[,.])/gi, ' респ. ')
      .replace(/(^|\s)область(\s|[,.])/gi, ' обл. ')
      .replace(/(^|\s)автономный округ(\s|[,.])/gi, ' а.окр. ')
      .replace(/(^|\s)домовладение(\s|[,.])/gi, ' двлд. ')
      .replace(/(^|\s)владение(\s|[,.])/gi, ' влд. ')
      .replace(/(^|\s)земельный участок(\s|[,.])/gi, ' з/у ')
      .replace(/(^|\s)квартира(\s|[,.])/gi, ' кв. ')
      .replace(/(^|\s)корпус(\s|[,.])/gi, ' к. ')
      .replace(/(^|\s)павильон(\s|[,.])/gi, ' пав. ')
      .replace(/(^|\s)строение(\s|[,.])/gi, ' стр. ');
      
    const parts = displayName.split(',');
    const trimmedParts = parts.slice(0, -3);
    const trimmedDisplayName = trimmedParts.join(',').trim();



    // setSearchText(prev => ({ ...prev, [type]:
    // `${road}, ${house_number}, ${city}`.trim().replace(/^,/, '').replace(/,$/, '') }));
    setSearchText(prev => ({ ...prev, [type]: trimmedDisplayName }));
    
    setSelectedLocations((prev) => ({ ...prev, [type]: trimmedDisplayName }));
    // setSelectedLocations((prev) => ({ ...prev, [type]: { city, road, house_number } }));
    setSuggestions(prev => ({...prev, [type]: []})); // Очищаем подсказки
    setShowSuggestions(prev => ({ ...prev, [type]: false }))
    handleBlur(type); // Снимаем фокус с инпута
    
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);

    if (!isNaN(lat) && !isNaN(lon)) {
      socket.emit('userPosToDriver', { [type]: { lat, lon } });
      console.log('EMIT TO DRIVER', [type], lat, lon);
      setSelectPosition((prevState) => ({ ...prevState, [type]: { lat, lon }}));
      // console.log('SELECTPOS LAT LON:', item, type, lat, lon)
    }
  }, [setSelectPosition, setSuggestions, handleBlur]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      
      fetchSuggestions(searchText.departure, 'departure');
      fetchSuggestions(searchText.arrival, 'arrival');
      
    }, FETCH_DELAY);
    return () => clearTimeout(debounceTimeout);
  }, [searchText, fetchSuggestions]);

  const handleSearchTextChange = (e, type) => {
    const newValue = e.target.value
    setSearchText((prev) => ({ ...prev, [type]: newValue}));
    if(!newValue.trim()) { // Если строка пустая (после удаления пробелов)
      setSelectedLocations(prev => ({ ...prev, [type]: null })) // Сбрасываем маркер
      setSelectPosition(prev => ({ ...prev, [type]: null })) // Сбрасываем маркер на карте
    }
    fetchSuggestions(newValue, type)
  };

  const [isShaking, setIsShaking] = useState(false);
  const [isTariffShaking, setIsTariffShaking] = useState(false);

  const handleTariffSelect = (tariff) => {
    if(selectedTariff === tariff) {
      setSelectedTariff(''); // Отмена выбора тарифа при дабл-клике
    } else {
      setSelectedTariff(tariff === selectedTariff ? null : tariff)
      setIsShaking(true); // Начало шейка
      setTimeout(() => setIsShaking(false), 300); // Конец шейка
    }
  };

  const handleGoClick = () => {
    if(!selectedTariff) {
      setIsTariffShaking(true);
      setTimeout(() => { 
        setIsTariffShaking(false);
      }, 300);
      return;
    }
    setLoading(true);
    if(socket) {
      socket.emit('newOrder', {
        userName: 'User',
        departure: searchText.departure,
        arrival: searchText.arrival,
        selectedTariff,
        userId: socket.id
      });
      setOrderSent(true);
    }
  };

  useEffect(() => {
    socket.on('driverAccepted', () => {
      setLoading(false);
      setDriverAccepted(true);
    })

    socket.on('driverArrived', () => {
      setDriverAccepted(false);
      setDriverArrived(true);
    })
    return () => {
      socket.off("driverAccepted");
      socket.off("driverArrived");
    };
  }, [socket]);

  

  



  return (
    <div className={`w-11/12 ${loading ? 'pointer-events-none user-select-none' : ''}`}>
      <div className={`p-3 z-10 rounded-lg mt-5 flex flex-col transition-all duration-500 ${loading || driverAccepted ? 'relative' : ''}`}>
        {(loading || driverAccepted || driverArrived) && (
          <div className='z-30 absolute top-0 left-0 w-full h-full bg-white flex items-center justify-center rounded-lg pointer-events-none'>
            <div className='flex flex-col gap-4 items-center justify-center'>
              {driverAccepted ? (
                <Image src="/check.png" width={25} height={25} alt="check" />
              ) : driverArrived ? (
                <Image src="/wait.png" width={25} height={25} alt="check" />
              ) : (
                <div className={`rounded-full h-32 w-32 border-b-2 border-gray-900 ${loading ? 'animate-spin' : ''}`}></div>
              )}
                <span className='text-sm font-medium text-gray-800'>
                  {driverAccepted ? 'Ваш заказ принят!' :
                  driverArrived ? 'Водитель на месте!' :
                  (loading ? 'Поиск свободных машин...' : '')}
                </span>
            </div>
          </div>
        )}
        
        {/* Departure Input */}
        <div className={`bg-white w-full z-10 p-3 rounded-lg mt-3 flex
        items-center gap-4 relative transition-all duration-150
        ease-in-out ${isFocused.departure ? 'bottom-[350px]' : 'bottom-0'}`}>
          <Image src='/destination.png' className='pointer-events-none'
            width={15} height={15} alt='' />

          <input type='text' className='bg-transparent w-11/12 outline-none text-xs'
            placeholder='Текущий адрес'
            value={searchText.departure}
            onChange={(e) => handleSearchTextChange(e, 'departure') }
            onFocus={(e) => {
              e.stopPropagation()
              handleFocus('departure')
            }}
            ref={ref => inputRef.current.departure = ref}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {/* Отобразить предложения для отправления */}
          {showSuggestions.departure && suggestions.departure.length > 0 && (
            <ul className='absolute bg-white right-0 z-20 w-full border border-gray-300 rounded-lg mt-24' ref={ref => suggestionsRef.current.departure = ref}>
              {suggestions.departure.map((suggestion) => (
                <li key={suggestion?.place_id || index}
                  className='max-h-12 overflow-y-hidden cursor-pointer
                  hover:bg-gray-100 hover:rounded-lg active:bg-gray-200'
                  onClick={() => handleSelectLocation(suggestion, 'departure') }
                >
                    <ListItemText secondary={suggestion?.display_name} />
                  {/* <Divider /> */}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Arrival Input */}
        <div className={`bg-white w-full z-10 p-3 rounded-lg mt-3 flex
        items-center gap-4 relative transition-all duration-150
        ease-in-out ${isFocused.arrival ? 'bottom-[350px]' : 'bottom-0'}`}>
          <Image src='/source.png' className='pointer-events-none'
            width={15} height={15} alt='' />

          <input type='text' className='bg-transparent w-11/12 outline-none text-xs'
            placeholder='Куда поедем?'
            value={searchText.arrival}
            onChange={(e) => handleSearchTextChange(e, 'arrival') }
            onFocus={(e) => {
              e.stopPropagation()
              handleFocus('arrival')
            }}
            ref={ref => inputRef.current.arrival = ref}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {/* Отобразить предложения для отправления */}
          {showSuggestions.arrival && suggestions.arrival.length > 0 && (
            <ul className='absolute bg-white right-0 z-20 w-full border border-gray-300 rounded-lg mt-24' ref={ref => suggestionsRef.current.arrival = ref}>
              {suggestions.arrival.map((suggestion) => (
                <li key={suggestion?.place_id || index}
                  className='max-h-12 overflow-y-hidden cursor-pointer
                  hover:bg-gray-100 hover:rounded-lg active:bg-gray-200'
                  onClick={() => handleSelectLocation(suggestion, 'arrival') }
                >
                    <ListItemText secondary={suggestion?.display_name} />
                  {/* <Divider /> */}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* icon & button block */}
        <div className={`border-b-4 border-gray-300 p-3 w-full z-10 rounded-lg mt-5 flex flex-row justify-between items-center
          ${isMarkersSet ? 'bg-white' : 'bg-white/80'}
          ${!selectedTariff && !loading ? 'border-red-400 border-1' : 'border-green-400 border-1'}
          `}>
          {isMarkersSet ? (
            <>
              {/* Tariff Econom Block icon */}
              <div className='flex space-x-4'>
                <div className={`flex flex-col items-center
                ${selectedTariff === 'econom' ? 'bg-gray-300 rounded-md' : ''}`}>
                  <button className={`rounded-md w-14 h-10 flex items-center justify-center mx-2
                    ${isShaking && selectedTariff === 'econom' ? 'animate-shake' : ''}
                    ${isTariffShaking && !selectedTariff ? 'animate-shake' : ''}`}
                      onClick={() => handleTariffSelect('econom')}
                  >
                    <img src='/econom_icon.png' alt='Econom' className='pointer-events-none mt-2 w-14 h-14' />
                  </button>
                  <span className={`text-xs font-light mt-1 pointer-events-none
                  ${isTariffShaking && !selectedTariff ? 'animate-shake' : ''}`}>Econom</span>
                </div>
              </div>
              {/* Tariff Comfort block icon */}
              <div className={`flex flex-col items-center
              ${selectedTariff === 'comfort' ? 'bg-gray-300 rounded-md' : ''}`}>
                <button className={`rounded-md w-14 h-10 flex items-center justify-center mx-2
                  ${isShaking && selectedTariff === 'comfort' ? 'animate-shake' : ''}
                  ${isTariffShaking && !selectedTariff ? 'animate-shake' : ''}`}
                    onClick={() => handleTariffSelect('comfort')}
                >
                  <img src='/comfort_icon.png' alt='Comfort' className='pointer-events-none mt-2 w-14 h-16' />
                </button>
                <span className={`text-xs font-light mt-1 pointer-events-none
                ${isTariffShaking && !selectedTariff ? 'animate-shake' : ''}`}>Comfort</span>
              </div>
              {/* Button Order */}
              <button className={`p-3 bg-black w-1/4 z-10 rounded-s-full text-white
                ${selectedTariff ? 'bg-black cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}`} 
                onClick={handleGoClick}
                disabled={orderSent || loading}
              >
                {orderSent ? '' : 'Go!'}
              </button>
            </>
          ) : (
            <div className={`flex gap-2 items-center p-2 pointer-events-none
             ${isMarkersSet ? '' : ''}`}>
              <Image src='/help_icon.png' width={20} height={20} alt='Help' />
                <span className='text-red-400 font-medium text-xs'>Введите адрес</span>
            </div>
          )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default SearchSection