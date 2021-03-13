import express from 'express';
import fetch from 'node-fetch';
import { timerStart, timerEnd } from './time.js';
import { get, set } from './cache.js';

export const router = express.Router();

router.get('/proxy', async (req, res) => {
  const {
    period, type,
  } = req.query;

  const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${type}_${period}.geojson`;

  let result;

  const timer = timerStart();
  try {
    result = await get(`${period}_${type}`);
  } catch (e) {
    console.error('error getting from cache', e);
  }

  if (result) {
    const data = {
      data: JSON.parse(result),
      info: {
        cached: true,
        time: timerEnd(timer),
      },
    };
    res.json(data);
    return;
  }

  try {
    result = await fetch(URL);
  } catch (e) {
    console.error('Villa við að sækja gögn frá vefþjónustu', e);
    res.status(500).send('Villa við að sækja gögn frá vefþónustu');
    return;
  }

  if (!result.ok) {
    console.error('Villa frá vefþjónustu', await result.text());
    res.status(500).send('Villa við að sækja gögn frá vefþjónustu');
    return;
  }

  const resultText = await result.text();
  await set(`${period}_${type}`, resultText);

  const gogn = {
    data: JSON.parse(resultText),
    info: {
      cached: false,
      time: timerEnd(timer),
    },
  };
  res.json(gogn);
});
