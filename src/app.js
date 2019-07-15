import bodyParser from 'body-parser';
//import cors from 'cors';
//import express from 'express';
import jwt from 'express-jwt';
import { JWT_SECRET, PUBLIC_STATIC_DIR } from './config';
import {
  api_err_handler,
  api_position,
  api_positions_search,
  api_positions_create,
  api_version
} from './api';

export const initApp = (app) => {
  //app.options('*', cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(jwt({ secret: JWT_SECRET, credentialsRequired: false }));
  //app.use(express.static(PUBLIC_STATIC_DIR));
  app.use(api_err_handler);
  app.get('/api/geolocation', api_version);
  app.get('/api/geolocation/position', api_position);
  app.get('/api/geolocation/positions', api_positions_search);
  app.post('/api/geolocation/positions', api_positions_create);
};
