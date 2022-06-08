import { withFilter } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as Redis from 'ioredis';

declare var process : {
  env: {
    REDIS_DOMAIN_NAME: string,
  }
}

const options = {
  host: process.env.REDIS_DOMAIN_NAME || '',
  port: 6379,
};

const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options)
});
const NEW_MESSAGE = 'new_message';

const subscriptionMessageResolver = {
  newMessage: {
    subscribe: withFilter(
      () => pubsub.asyncIterator(NEW_MESSAGE),
      (payload, variables) => {
        return payload.receiverId === variables.receiverId;
      }
    ),
  },
}

export default subscriptionMessageResolver;