import connectToDatabase from './database';
import logger from './logger';
import { server } from './server';

const port = process.env.PORT || 3033;

connectToDatabase(process.env.MONGO_URI)
  .then(() => {
    logger.info(`Connected to mongoDB at ${process.env.MONGO_URI}`);
  })
  .catch((err) => {
    logger.error(`Connection to mongoDB failed at ${process.env.MONGO_URI}`);
    logger.error(err.message);
  });

server.listen(port, () => {
  logger.info(`Server started, listening to port ${port}`);
});
