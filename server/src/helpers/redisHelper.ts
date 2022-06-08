const dotenv = require('dotenv');
dotenv.config();

import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as Redis from 'ioredis';

declare var process : {
  env: {
    REDIS_DOMAIN_NAME: string,
    JWT_AUTH_SALT: string,
  }
}

const options = {
  host: process.env.REDIS_DOMAIN_NAME || '',
  port: 6379,
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