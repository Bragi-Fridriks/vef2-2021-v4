// TODO útfæra proxy virkni
import express from 'express';
import fetch from 'node-fetch';

import { timerStart, timerEnd } from './time.js';
import { getCachedEarthquakes, setCachedEarthquakes } from './cache.js';

export const router = express.Router();

