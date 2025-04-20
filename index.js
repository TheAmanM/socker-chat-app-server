// server/index.ts
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cron from "node-cron";

const corsObject = {
  origin: [
    "http://localhost:5173",
    "https://theamanm.github.io",
    "https://theamanm.github.io/socket-chat-app",
  ],
  methods: ["GET", "POST"],
  credentials: true
};

const app = express();
app.use(cors(corsObject));
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: corsObject,
});

// 🔁 CRON JOB: runs every minute
cron.schedule("* * * * *", () => {
  console.log(`[CRON] ${new Date().toISOString()}: Cron job executed`);
});

io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  socket.on("message", ({ sender, content }) => {
    console.log(`📩 ${sender}: ${content}`);
    socket.broadcast.emit("message", { sender, content });
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

httpServer.listen(3000, () => {
  console.log("🚀 Server listening on http://localhost:3000");
});
