import bodyParser from 'body-parser';
import {
  initApi,
  api_err_handler,
  api_position_current,
  api_positions_search,
  api_positions_create,
  api_version,
} from './api';

export const initApp = (app, db) => {
  initApi(db);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(api_err_handler);
  app.get('/api/geolocation/position', api_position_current);
  app.get('/api/geolocation/positions', api_positions_search);
  app.post('/api/geolocation/positions', api_positions_create);
  app.get('/api/geolocation', api_version);
};
