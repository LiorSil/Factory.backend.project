//export
module.exports = function authenticateToken(req, res, next) {
  const jwt = require("jsonwebtoken");
  //get token from x-access-token
  const token = req.headers["x-access-token"];

  //if no token
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  //verify token
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: "Unauthorized" });
    }
    next();
  });
};
