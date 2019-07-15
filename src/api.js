import { logDebug } from './log';
import { VERSION, IS_DEV } from './config';
import {
  newId,
  currentPositionsRepo,
  positionHistoryRepo,
} from './db';

const debug = IS_DEV;

export const api_err_handler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'invalid token' });
    return;
  }
  res.status(500).json({ error: err });//err.message });
};

export const api_version = (req, res) => {
  res.json({ ts: new Date(), version: VERSION });
};

export const api_position = (req, res) => {
  logDebug('GET /api/geolocation/position');
  
  const user_id = req.header('x-user-id');// special header provided by gateway
  const params = { user_id };
  const data = currentPositionsRepo.findOne(params);
  res.json(data);
};

export const api_positions_search = (req, res) => {
  logDebug('GET /api/geolocation/positions');
  
  const data = currentPositionsRepo.listAll();// TODO: search in an area
  res.json(data);
};

export const api_positions_create = async (req, res) => {
  const urlInfo = `POST /api/geolocation/positions`;
  logDebug(urlInfo);
  
  let data = {}, params;
  try {
    const user_id = req.header('x-user-id');// special header provided by gateway
    let { position } = req.body;
    const ts = new Date();
    const newRow = { id: newId(), ts, user_id, position };
    positionHistoryRepo.insertOne(newRow);// keep a copy in history
    params = { user_id };
    const rowIdx = currentPositionsRepo.findIdx(params);
    const rowFound = currentPositionsRepo.findOne(params);
    if (rowFound) { // update
      const updatedRow = Object.assign(rowFound, { ts, position });
      data.result = currentPositionsRepo.updateOne(rowIdx, updatedRow);
    } else { // create
      data.result = currentPositionsRepo.insertOne(newRow);
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
