import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import authRouter from "./routes/auth.route.js";
import conversationRouter from "./routes/conversation.route.js";
import messageRouter from "./routes/message.route.js";
import http from "http";
import { initSocket } from "./socket/socket.js";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3003;

dotenv.config();
connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);
app.use("/", authRouter);
app.use("/conversation", conversationRouter);
app.use("/message", messageRouter);

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});
