// authMiddleware.js

const jwt = require("jsonwebtoken");
const session = require("express-session");

const authMiddleware = (req, res, next) => {
  const token = session.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, "secret"); // Verify token with your secret key
    req.user = decoded; // Attach decoded user information to request object

    next(); // User is authenticated, proceed to the next middleware/route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};



module.exports = authMiddleware;
