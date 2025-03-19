import cookie from "cookie";
import jwt from "jsonwebtoken";

const socketAuthMiddleware = (socket, next) => {
  if (!socket.request.headers.cookie) {
      return next(new Error("Unauthorized: No cookies sent"));
  }

  const cookies = cookie.parse(socket.request.headers.cookie);
  const token = cookies.token; // Extract the HttpOnly token

  if (!token) {
      return next(new Error("Unauthorized: No token found"));
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // Attach user info to socket
      next(); // Allow connection
  } catch (err) {
      return next(new Error("Unauthorized: Invalid token"));
  }
};

export default socketAuthMiddleware;