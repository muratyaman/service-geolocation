import dotenv from 'dotenv';
import path from 'path';
import packageObj from '../package.json';

dotenv.config();
const penv = process.env;

let config = {
  VERSION: packageObj.version,
  IS_PRODUCTION: penv.NODE_ENV && (penv.NODE_ENV === 'production'),
  IS_TEST: penv.NODE_ENV && (penv.NODE_ENV === 'test'),
  IS_DEV: penv.NODE_ENV && (penv.NODE_ENV === 'dev'),
};

config = Object.assign(config, {
  CONSOLE_LOG: (penv.CONSOLE_LOG || 0) && !config.IS_TEST,
  HTTP_PORT: penv.HTTP_PORT || 0, // 0 to pick a free port
  DB_ADAPTER: penv.DB_ADAPTER,
  LOW_FILENAME: penv.LOW_FILENAME, // ../db.json
  MONGODB_URL: penv.MONGODB_URL || 'mongodb://localhost:27017',
  MONGODB_NAME: penv.MONGODB_NAME || 'service_geolocation',
  PUBLIC_STATIC_DIR: penv.PUBLIC_STATIC_DIR || path.join(__dirname, '..', 'public'),
});

export default config;
