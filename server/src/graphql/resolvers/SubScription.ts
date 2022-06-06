import { withFilter } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';

const pubsub = new RedisPubSub();
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