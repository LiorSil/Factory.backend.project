// middleware/disableCacheMiddleware.js

const disableCacheMiddleware = (req, res, next) => {
  // Set cache control headers to disable caching
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  next(); // Move to the next middleware/route handler
};

module.exports = disableCacheMiddleware;
