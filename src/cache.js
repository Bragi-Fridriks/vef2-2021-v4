// TODO útfæra redis cache
import redis from 'redis';
import dotenv from 'dotenv';

import { promisify } from 'util';

dotenv.config();

export let getCachedEarthquakes;
export let setCachedEarthquakes;

const redisOptions = {
    url: 'redis://127.0.0.1:6379/0',
  };
  
  const client = redis.createClient(redisOptions);
  
  const asyncGet = util.promisify(client.get).bind(client);
  const asyncSet = util.promisify(client.mset).bind(client);

  getCachedEarthquakes = async (key) => {
      const earthquakes = await asyncGet(key);
      return earthquakes;
  };

  setCachedEarthquakes = async (key, earthquakes) => {
      await asyncSet(key, earthquakes);
  };