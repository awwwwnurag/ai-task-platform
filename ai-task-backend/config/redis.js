const Redis = require('ioredis');

const redisClient = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL, { tls: { rejectUnauthorized: false } }) // Support Upstash rediss:// format securely
  : new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined
    });

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

module.exports = redisClient;
