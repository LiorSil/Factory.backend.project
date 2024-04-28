// Set cache control headers to disable caching

const disableCacheMiddleware = (req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  next(); // Move to the next middleware/route handler
};

module.exports = disableCacheMiddleware;
