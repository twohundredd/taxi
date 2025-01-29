import { Server } from "socket.io";
console.log("Socket.io imported!");

const PORT = 3001;

const io = new Server(3001, {
  cors: {
    origin: "http://localhost:3000",
  },
});
console.log(`Server started on PORT ${PORT}`);

io.on("connection", (socket) => {
  console.log("connection")
  console.log("user connected: ", socket.id);

  socket.on('newOrder', (data) => {
    console.log("newOrder received:", data);
    io.emit('newOrder', data);
  });

  // socket.on('userPosToDriver', (data) => {
  //   console.log('data ARRIVED from USER:', data);
  // })

  socket.on('userPosToDriver', (data) => {
    console.log('data ARRIVED from USER:', data); // Выводим весь объект
    for (const key in data) {
       if (data.hasOwnProperty(key)) {
        const { lat, lon } = data[key];
        console.log(`Received coordinates for ${key}: lat = ${lat}, lon = ${lon}`);
        // Здесь дальше можешь обрабатывать данные по ключам
        io.emit('userPosToDriver', { [key]: { lat, lon } });
       }
    }
  });

  socket.on('acceptOrder', (data) => {
    console.log("[server.js] Driver accepted order");
    io.to(data.order.userId).emit('driverAccepted', { order: data.order })
  });

  socket.on('driverOnPlace', (data) => {
    console.log("Driver has arrived on Location", data)
    io.to(data.order.userId).emit('driverArrived', { order: data.order })
  });

  socket.on("disconnect", (reason) => {
  console.log("user disconnected: ", socket.id);
  });
});