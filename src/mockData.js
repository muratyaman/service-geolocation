import { v4 as uuid } from 'uuid';

const mockCurrentPositions = () => [
  {
    id: uuid(),
    ts: 1563203787031, // on server
    user_id: uuid(),
    position: {
      // raw data: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation
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

export default () => ({
  current_positions: mockCurrentPositions(),
  position_history: [],
});
