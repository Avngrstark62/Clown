import SocketConnection from "../controllers/socket.controller.js";

const socketRoutes = (io) => {
  io.on("connection", (socket) => {
    const socketConnection = new SocketConnection(io, socket);
    socketConnection.handleConnection();
  });
};

export default socketRoutes;