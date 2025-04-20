import { Server } from "socket.io";
import http from "http";
// const cron = require('node-cron');
import cron from 'node-cron';

// Define the cron job that runs every 12 hours
cron.schedule('0 */12 * * *', () => {
  const currentTimeUTC = new Date().toISOString();
  console.log(`Current time in UTC: ${currentTimeUTC}`);
});


const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let clients = [];

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", (username) => {
    clients.push(username);
    io.emit("user-joined", username);
  });

  socket.on("message", (message) => {
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const port = 5000;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
