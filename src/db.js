import { v4 as uuid } from 'uuid';
import { parse, format } from 'date-fns';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import Memory from 'lowdb/adapters/Memory';
import { logDebug } from './log';
import { FILE_DB, IS_TEST } from './config';

export const newId = () => uuid();

const mockCurrentPositions = () => [
  {
    id: uuid(),
    ts: 1563203787031, // on server
    user_id: uuid(),
    position: {// raw data: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation
      coords: {
        accuracy: 20,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        latitude: 51.5219094,
        longitude: -0.105946,
        speed: null,
      },
      timestamp: 1563203787031,// on user device
    },
  }
];

const mockData = () => ({
  current_positions: mockCurrentPositions(),
  position_history: [],
});

const defaultData = {
  current_positions: [],
  position_history: [],
};

let db;

export const newDb = async () => {
  let adapter, generateDefaultData = false;
  if (IS_TEST) {
    adapter = new Memory();
    generateDefaultData = true;
  } else {
    adapter = new FileSync(FILE_DB);
  }
  db = await low(adapter);
  let data = defaultData;
  if (generateDefaultData) {// set some defaults?
    data = mockData();
  }
  // data required only when db is empty
  await db.defaults(data).write();
  return db;
};

export const dbRepo = (name) => {
  const repoDesc = `dbRepo(${name})`;
  logDebug('NEW', repoDesc);
  return {
    findOne: (params) => {
      const row = db.get(name).find(params).value();
      logDebug(`${repoDesc}.findOne`, params, row);
      return row;
    },
    findIdx: (filterFunc) => {
      const row = db.get(name).value().findIndex(filterFunc);
      logDebug(`${repoDesc}.findIdx`, row);
      return row;
    },
    listAll: () => {
      const rows = db.get(name).value();
      logDebug(`${repoDesc}.listAll`, rows.length);
      return rows;
    },
    insertOne: (row) => {
      const newRows = db.get(name).push(row).write();
      logDebug(`${repoDesc}.insertOne`, row, newRows.length);
      return 0 < newRows.length;
    },
    updateOne: (idx, newRow) => {
      return db.update(name, rows => {
        //logDebug('UPDATE START', name, rows);
        let row = rows[idx];
        rows[idx] = Object.assign(row, newRow);
        //logDebug('UPDATE END', name, rows);
        return rows;
      }).write();
    },
    deleteOne: (idx) => {
      let rows = db.get(name);
      delete rows[idx];
      return db.set(name, rows).write();
    },
  };
};

export const currentPositionsRepo = dbRepo('current_positions');
export const positionHistoryRepo = dbRepo('position_history');
