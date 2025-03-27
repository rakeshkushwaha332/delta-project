// logger.js
const winston = require('winston');
const { combine, timestamp, printf, colorize } = winston.format;

// Define a custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Set the default log level
  format: combine(
    colorize(), // Add colors to the logs (for console output)
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp
    logFormat // Apply the custom log format
  ),
  transports: [
    // Log to the console
    new winston.transports.Console(),
    // Log to a file
    new winston.transports.File({ filename: 'logs/app.log' }),
  ],
});

// Export the logger
module.exports = logger;