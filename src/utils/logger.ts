import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

interface LogMetadata {
  [key: string]: string | number | boolean | null | undefined;
}

export const logError = (message: string, error?: Error, metadata?: LogMetadata): void => {
  logger.error(message, {
    error: error?.message,
    stack: error?.stack,
    ...metadata,
  });
};

export const logInfo = (message: string, metadata?: LogMetadata): void => {
  logger.info(message, metadata);
};

export default logger; 