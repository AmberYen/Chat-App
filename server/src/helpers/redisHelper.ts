const dotenv = require('dotenv');
dotenv.config();

import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as Redis from 'ioredis';

declare var process : {
  env: {
    REDIS_DOMAIN_NAME: string,
    REDIS_PORT: number,
    REDIS_PASSWORD: string,
    JWT_AUTH_SALT: string,
  }
}

const options = {
  host: process.env.REDIS_DOMAIN_NAME || '',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || '',
};
export class RedisHelper {
  /**
   * This function returns redis pubsub instance
   */
  public getPubSub(): RedisPubSub {
    return new RedisPubSub({
      publisher: new Redis(options),
      subscriber: new Redis(options)
    });
  }
}