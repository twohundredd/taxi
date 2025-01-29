"use client"
import React, { useState, useEffect, useRef } from 'react';
import Map from "../../components/Map/Map";
import io from 'socket.io-client';

const socket = io("http://localhost:3001");


export default function DriverPage() {

  const [order, setOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderAccepted, setOrderAccepted] = useState(false);
  const [driverArrived, setDriverArrived] = useState(false);
  
  const [position, setPosition] = useState({ lat: '', lng: '' });
  
  let [userPosition, setUserPosition] = useState({});
  let [tempUserPosition, setTempUserPosition] = useState({});
  const tempUserPositionRef = useRef(null); // Используем useRef

  const handlePositionChange = (newPosition) => {
    setPosition(newPosition);
  };

  useEffect(() => {
    if(socket) {
      socket.on('newOrder', (orderData) => {
        console.log("New order recieved:", orderData)
        setOrder(orderData);
        setIsModalOpen(true);
        if(tempUserPositionRef.current) {
          setUserPosition(tempUserPositionRef.current);
          tempUserPositionRef.current = null;
        }
      });
      
      socket.on('userPosToDriver', (data) => {
        console.log('data ARRIVED for DRIVER:', data)
        if(!tempUserPositionRef.current) {
          tempUserPositionRef.current = {}
        }

        for(const key in data) {
          if(data.hasOwnProperty(key)) {
            const {lat, lon} = data[key];
            tempUserPositionRef.current = {...tempUserPositionRef.current, [key]: {lat, lon}}
            // userPosition[key] = { lat, lon }
          }
        }
        // setTempUserPosition(temp)
        console.log('TEMP:', tempUserPositionRef.current)
      })
    }
    return () => {
      if(socket) {
        socket.off('newOrder');
        socket.off('userPosToDriver');
      }
    };
  }, [socket]);

  const handleAcceptOrder = () => {
    if (order && socket) {
        socket.emit("acceptOrder", {
          order: order,
          driverId: socket.id,
          message: 'Заказ принят!'
        });
        console.log('Заказ принят!');
        // Выводить функцию - заказ принят = тру
        setOrderAccepted(true);
        setIsModalOpen(false);
    }
  };

  const handleSkipOrder = () => {
    setOrder(null);
    setIsModalOpen(false);
    setOrderAccepted(false);
    setUserPosition({});
    setTempUserPosition({});
    tempUserPositionRef.current = null;
  };

  const handleAtPlace = () => {
    setDriverArrived(true);
    socket.emit("driverOnPlace", {
      order: order,
      driverId: socket.id,
      message: 'Вы на месте!'
    });
    
    console.log('Вы на месте!');
  }
  
  return (
    <div>
      {isModalOpen && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 bg-white/65 p-5 border
        border-gray-300 rounded-md z-1000 shadow-md">
          <div className="">
            {order &&
              <div className=''>
                <h3 className='text-lg font-semibold mb-2 text-center'>Новый заказ</h3>
                <p className="mb-1 text-sm"><b>От:</b> {order.departure}</p>
                <p className="mb-1 text-sm"><b>До:</b> {order.arrival}</p>
                <p className="mb-3 text-sm"><b>Тариф:</b> {order.selectedTariff}</p>
                <div className='flex flex-row justify-around gap-2 text-sm'>
                  <button className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded' onClick={handleAcceptOrder} disabled={orderAccepted}>
                    {orderAccepted ? `'${disabled}Уже принят'` : 'Принять'}
                  </button>
                  <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' onClick={handleSkipOrder}>
                    Пропустить
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      )}
      <div>
          {orderAccepted && order && (
            <button className={`absolute
              top-[85%] left-1/2 transform -translate-x-1/2 z-1500
              p-3 w-1/4 rounded-full text-white
              ${driverArrived ? 'bg-gray-500' : 'bg-black'}`}
              onClick={handleAtPlace} disabled={driverArrived}>
                На месте
            </button>
          )}
          <div className="p-6 flex justify-center">
            <div className="relative z-0">
              <Map handlePosition={handlePositionChange}
              userPosition={userPosition}
               />
            </div>
          </div>
      </div>
    </div>
  );
}