module.exports = function authenticateToken(req, res, next) {
  const jwt = require("jsonwebtoken");
  const token = req.headers["x-access-token"];

  //if token is not provided
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  //verify token
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: "Unauthorized" });
    }

  //if token is verified successfully then pass the request to the next middleware
    next();
  });
};
