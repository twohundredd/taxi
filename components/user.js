import { io } from 'socket.io-client';

const socket = io('http://localhost:5173');

const userName = 'User' + Date.now();

socket.emit('user-connect', userName);

// Функция для отправки заказа
function sendOrder(departure, arrival, markers) {
    socket.emit('send-order', { userName, departure, arrival, markers });
}

// Обработчик события, когда водитель принял заказ
socket.on('order-accepted', (data) => {
    const { orderId, driverName } = data;
    console.log(`Водитель ${driverName} принял ваш заказ ${orderId}`);
    alert(`Водитель ${driverName} принял ваш заказ ${orderId}`)
});

// Обработчик события, когда водитель приехал
socket.on('driver-arrived', (data) => {
    const { orderId, driverName } = data;
    console.log(`Водитель ${driverName} приехал на место по заказу ${orderId}`);
    alert(`Водитель ${driverName} приехал на место по заказу ${orderId}`)
});

export default socket