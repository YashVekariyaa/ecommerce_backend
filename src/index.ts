import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connects from "./config/db";
import { router } from "./routes/routes";
import bodyParser from "body-parser";
// import { Server } from "socket.io";
import http from "http";

const PORT = process.env.PORT || 8000;
const app = express();
// const server = http.createServer(app);

app.use(bodyParser.json());
app.use("/", router);
app.use("/profile_Image", express.static(__dirname + "/Upload/UserProfile"));
app.use("/profile_Image", express.static(__dirname + "/Upload/AdminProfile"));
app.use("/img", express.static(__dirname + "/Upload/Products"));
app.use(
  "/galleryimg",
  express.static(__dirname + "/Upload/Products/galleryImage")
);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000", // Adjust to your frontend URL
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   socket.on("message", (data) => {
//     console.log("Message received:", data);
//     io.emit("message", data); // Broadcast to all clients
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

app.listen(PORT, (): void => {
  console.log(`server is running on ${PORT}`);
});

connects();
