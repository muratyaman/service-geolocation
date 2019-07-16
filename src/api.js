import { logDebug } from './log';
import config from './config';
import {
  newId,
  currentPositionsRepo,
  positionHistoryRepo,
} from './db';

const debug = !! config.IS_DEV;

export const initApi = (db) => {
  // do something
};

export const api_err_handler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'invalid token' });
    return;
  }
  res.status(500).json({ error: err });//err.message });
};

export const api_version = (req, res) => {
  res.json({ ts: new Date(), version: config.VERSION });
};

export const api_position_current = async (req, res) => {
  logDebug('GET /api/geolocation/position');
  
  const user_id = req.header('x-user-id');// special header provided by gateway
  const params = { user_id };
  const data = await currentPositionsRepo().findOne(params);
  res.json(data);
};

export const api_positions_search = async (req, res) => {
  logDebug('GET /api/geolocation/positions');
  
  const data = await currentPositionsRepo().listAll();// TODO: search in an area
  res.json(data);
};

export const api_positions_create = async (req, res) => {
  const urlInfo = `POST /api/geolocation/positions`;
  logDebug(urlInfo);
  
  let data = {}, params;
  try {
    const cpRepo = currentPositionsRepo();
    const phRepo = positionHistoryRepo();
    
    const user_id = req.header('x-user-id');// special header provided by gateway
    const { position } = req.body;
    const ts = new Date();
    const newRow = { id: newId(), ts, user_id, position };
    await phRepo.insertOne(newRow);// keep a copy in history, without await
    params = { user_id };
    //const rowIdx = cpRepo.findIdx(params);
    const rowFound = await cpRepo.findOne(params);
    if (rowFound) { // update
      const updatedRow = Object.assign(rowFound, { ts, position });
      data.result = await cpRepo.updateOne(rowFound._id, updatedRow);
    } else { // create
      data.result = await cpRepo.insertOne(newRow);
    }
  } catch (err) {
    data.error = err.message;
    if (debug) {
      data.debug = err;
    }
    logDebug(urlInfo + ' ERR', err);
  }
  res.json(data);
};
