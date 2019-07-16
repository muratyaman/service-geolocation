import express from 'express';
import http from 'http';
import config from './config';
import { newDb } from './db';
import { logDebug } from './log';
import { initApp } from './app';

let app, db;

(async () => {
  try {
    db = await newDb(config);
  } catch (e) {
    console.error('Error connecting to db', e);
  }
  if (db) {
    app = express();
    initApp(app, db);
    
    http.createServer(app).listen(config.HTTP_PORT, function () {
      logDebug('Geolocation service listening on HTTP port', config.HTTP_PORT);
    });
  }
})();
