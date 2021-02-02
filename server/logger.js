const winston = require('winston');

const getTransports = () => {
  if (process.env.NODE_ENV === 'test') {
    return [
      new winston.transports.File({ filename: 'test.log', format: fileFormat }),
    ];
  } else if (process.env.NODE_ENV === 'production') {
    return [
      new winston.transports.Console({ format: consoleFormat }),
      new winston.transports.File({ filename: 'app.log', format: fileFormat }),
    ];
  } else {
    return [
      new winston.transports.Console({ format: consoleFormat }),
      new winston.transports.File({ filename: 'dev.log', format: fileFormat }),
    ];
  }
};

const consoleFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf((log) => {
    return winston.format
      .colorize()
      .colorize(
        log.level,
        `${new Date(log.timestamp).toDateString()} ${new Date(
          log.timestamp
        ).toLocaleTimeString('fi-FI', { hour12: false })} [ ${log.level} ]\t${
          log.message
        }`
      );
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf((log) => {
    return `${new Date(log.timestamp).toDateString()} ${new Date(
      log.timestamp
    ).toLocaleTimeString('fi-FI', { hour12: false })} [ ${log.level} ]\t${
      log.message
    }`;
  })
);

const logger = winston.createLogger({
  transports: getTransports(),
});

// Set up logging levels
if (process.env.NODE_ENV !== 'production') {
  logger.level = 'debug';
} else {
  logger.level = 'info';
}

module.exports = logger;
