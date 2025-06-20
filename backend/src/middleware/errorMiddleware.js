const config = require('../config/config');

// Handle 404 errors
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log the error
  console.error(`Error: ${err.message}`);
  if (config.server.nodeEnv === 'development') {
    console.error(err.stack);
  }
  
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: config.server.nodeEnv === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };