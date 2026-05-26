const { createClient } = require("redis");
const { logger } = require("../utils/logger");

let client = null;
let isConnected = false;

async function connect() {
  if (isConnected && client) return client;

  const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || "127.0.0.1"}:${process.env.REDIS_PORT || 6379}`;

  client = createClient({
    url: redisUrl,
    password: process.env.REDIS_PASSWORD || undefined,
    database: parseInt(process.env.REDIS_DB) || 0,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          logger.error("Redis max reconnection attempts reached");
          return new Error("Redis connection failed");
        }
        return Math.min(retries * 100, 3000);
      },
      connectTimeout: 10000,
    },
  });

  client.on("error", (err) => {
    logger.error("Redis client error:", err.message);
    isConnected = false;
  });

  client.on("connect", () => {
    logger.info("Redis client connecting...");
  });

  client.on("ready", () => {
    logger.info("Redis client ready and connected");
    isConnected = true;
  });

  client.on("reconnecting", () => {
    logger.warn("Redis client reconnecting...");
    isConnected = false;
  });

  client.on("end", () => {
    logger.warn("Redis client connection closed");
    isConnected = false;
  });

  try {
    await client.connect();
    await client.ping();
    isConnected = true;
    return client;
  } catch (err) {
    logger.warn(`Redis connection failed: ${err.message}. Falling back to in-memory cache.`);
    isConnected = false;
    client = null;
    return null;
  }
}

async function get(key) {
  if (!isConnected || !client) return null;
  try {
    const val = await client.get(key);
    if (!val) return null;
    return JSON.parse(val);
  } catch (err) {
    logger.warn(`Redis GET error for key "${key}": ${err.message}`);
    return null;
  }
}

async function set(key, value, ttlSeconds = 3600) {
  if (!isConnected || !client) return false;
  try {
    await client.setEx(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch (err) {
    logger.warn(`Redis SET error for key "${key}": ${err.message}`);
    return false;
  }
}

async function del(key) {
  if (!isConnected || !client) return false;
  try {
    await client.del(key);
    return true;
  } catch (err) {
    logger.warn(`Redis DEL error for key "${key}": ${err.message}`);
    return false;
  }
}

async function delPattern(pattern) {
  if (!isConnected || !client) return 0;
  try {
    const keys = await client.keys(pattern);
    if (!keys.length) return 0;
    await Promise.all(keys.map((k) => client.del(k)));
    logger.info(`Redis: deleted ${keys.length} keys matching "${pattern}"`);
    return keys.length;
  } catch (err) {
    logger.warn(`Redis DEL pattern error for "${pattern}": ${err.message}`);
    return 0;
  }
}

async function exists(key) {
  if (!isConnected || !client) return false;
  try {
    return (await client.exists(key)) === 1;
  } catch {
    return false;
  }
}

async function ttl(key) {
  if (!isConnected || !client) return -1;
  try {
    return await client.ttl(key);
  } catch {
    return -1;
  }
}

async function increment(key, amount = 1, ttlSeconds = 86400) {
  if (!isConnected || !client) return null;
  try {
    const val = await client.incrBy(key, amount);
    if (val === amount) {
      await client.expire(key, ttlSeconds);
    }
    return val;
  } catch (err) {
    logger.warn(`Redis INCR error for key "${key}": ${err.message}`);
    return null;
  }
}

async function getOrSet(key, fetchFn, ttlSeconds = 3600) {
  const cached = await get(key);
  if (cached !== null) {
    logger.debug(`Cache HIT: ${key}`);
    return { data: cached, cached: true };
  }

  logger.debug(`Cache MISS: ${key}`);
  const fresh = await fetchFn();
  await set(key, fresh, ttlSeconds);
  return { data: fresh, cached: false };
}

async function healthCheck() {
  if (!isConnected || !client) return { connected: false, latencyMs: null };
  try {
    const start = Date.now();
    await client.ping();
    return { connected: true, latencyMs: Date.now() - start };
  } catch {
    return { connected: false, latencyMs: null };
  }
}

async function disconnect() {
  if (client && isConnected) {
    await client.quit();
    isConnected = false;
    client = null;
    logger.info("Redis client disconnected");
  }
}

function buildKey(...parts) {
  return parts.filter(Boolean).join(":");
}

module.exports = {
  connect,
  get,
  set,
  del,
  delPattern,
  exists,
  ttl,
  increment,
  getOrSet,
  healthCheck,
  disconnect,
  buildKey,
  isReady: () => isConnected,
  getClient: () => client,
};
