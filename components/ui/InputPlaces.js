import React, { useEffect, useRef, useState } from 'react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { FiSearch } from 'react-icons/fi'
// import { Coords } from 'leaflet'
import cn from 'classnames'

// interface IInputPlaces {
//     cbSuccess: (address: string, location: Coords) => void
//     type: 'from' | 'to'
// }

// const InputPlaces = (props) => {
//   const { cbSuccess, type } = props;

  const InputPlaces = ({ cbSuccess, type }) => {

    const inputRef = useRef<HTMLInputElement>(null);

    const setFocus = () => inputRef?.current?.focus()

    const isFrom = type === 'from'

    useEffect(() => {
      if(isFrom) setFocus()
    }, [isFrom])

    
    const [address, setAddress] = useState('')

    const handleSelect = (address) => {
      geocodeByAddress(address)
        .then(results => getLatLng(results[0]))
        .then(location => {
          if (location) { 
            cbSuccess(address, location);
            setAddress(address);
          } else {
            console.error("Geocoding failed to return location.");
          }
        })
        .catch(err => console.error('Error', err));
    };

    return (
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
        onError={err => console.log('Error', err)}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className={cn('shadow-lg', { 'mb-5': isFrom })}>
            <div className='py-4 px-5 bg-white
            rounded-lg flex items-center'
            style={
              suggestions.lenght
              ? {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0
                }
              : {}
            }
            onClick={setFocus}
            >
              <FiSearch color={isFrom ? '#ffbc00'
                : '#615F5D'} className='mr-3'
                size={26}
              />
              <input
                {...getInputProps({
                  ref: inputRef,
                  placeholder: isFrom ? 'Текущая позиция' : 'Куда поедем?',
                  className: 'outline-none w-full text-gray-800',
                })}
              />
              {!isFrom && (
                <div className='absolute right-5
                text-sm text-gray-400'>
                  ~ min.
                </div>
              )}
            </div>

            <div
              className={cn('absolute w-full h-0 overflow-y-auto rounded-b-lg z-10', {
                'h-48': suggestions.length || loading
              })}>
              {loading && <div className='p-2 bg-white'>Loading...</div>}
              {
                suggestions.map((suggestion, idx) =>
                  <div
                  {...getSuggestionItemProps(suggestion, {
                    className: cn('cursor-pointer p-3', {
                      'bg-gray-100': suggestion.active,
                      'bg-white': !suggestion.active
                    })
                  })}
                    key={`loc ${idx}`}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                )
              }
            </div>

          </div>
        )}
      </PlacesAutocomplete>
    )
}

export default InputPlaces