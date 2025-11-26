"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const routes_1 = require("./routes/routes");
const body_parser_1 = __importDefault(require("body-parser"));
const PORT = process.env.PORT || 8000;
const app = (0, express_1.default)();
// const server = http.createServer(app);
app.use(body_parser_1.default.json());
app.use("/", routes_1.router);
app.use("/profile_Image", express_1.default.static(__dirname + "/Upload/UserProfile"));
app.use("/profile_Image", express_1.default.static(__dirname + "/Upload/AdminProfile"));
app.use("/img", express_1.default.static(__dirname + "/Upload/Products"));
app.use("/galleryimg", express_1.default.static(__dirname + "/Upload/Products/galleryImage"));
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
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
(0, db_1.default)();
