import axios from 'axios';

const REQUEST_TIMEOUT_MS = 10_000;

export const request = axios.create({
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
  },
});
