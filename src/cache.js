import redis from 'redis';
import dotenv from 'dotenv';
import util from 'util';

dotenv.config();

export let get; // eslint-disable-line import/no-mutable-exports
export let set; // eslint-disable-line import/no-mutable-exports

const {
  REDIS_URL = 'redis://127.0.0.1:6379/0',
} = process.env;

try {
  let client;
  if (REDIS_URL) {
    client = redis.createClient({ url: REDIS_URL });
  }

  const asyncGet = util.promisify(client.get).bind(client);
  const asyncSet = util.promisify(client.set).bind(client);

  get = async (key) => {
    const data = await asyncGet(key);
    return data;
  };

  set = async (key, data) => {
    await asyncSet(key, data);
  };
} catch (e) {
  console.error('Error setting up redis client, running without cache', e);
  get = async (key) => false; // eslint-disable-line no-unused-vars
  set = async (key, value) => { }; // eslint-disable-line no-unused-vars
}
