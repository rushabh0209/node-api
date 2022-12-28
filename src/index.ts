import { connect, set } from 'mongoose';
import app from './app';
import config from './config/config';
import logger from './config/logger';

let server: any;

set('strictQuery', true);

connect(config.mongoose.url).then(() => {
  logger.info('Connected to MongoDB');

  server = app.listen(config.port, () => {
    logger.info(`⚡️[server]: Server is running at https://localhost:${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: any) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
