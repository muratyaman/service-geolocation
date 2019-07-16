import { v4 as uuid } from 'uuid';
//import { parse, format } from 'date-fns';
import dbAdapters from './dbAdapters';
import { logDebug } from './log';
import mockData from './mockData';

export const newId = () => uuid();

const defaultData = {
  current_positions: [],
  position_history: [],
};

let dbAdapter, db;

export const newDb = async (config) => {
  const da = config.DB_ADAPTER;
  if (!(da in dbAdapters)) {
    throw new Error('Unknown db adapter ' + da);
  }
  dbAdapter = dbAdapters[da];
  
  const generateDefaultData = !! config.IS_TEST;
  let data = defaultData;
  if (generateDefaultData) {// set some defaults?
    data = mockData();
  }
  
  db = await dbAdapter.newDb(config, data);
  logDebug('new db adapter ready');
  return db;
};

export const currentPositionsRepo = () => dbAdapter.dbRepo('current_positions');
// TODO: use UPSERT option:  result = await coll.updateOne({ user_id: 123 }, {$set: { position }}, { upsert: true });

export const positionHistoryRepo = () => dbAdapter.dbRepo('position_history');
