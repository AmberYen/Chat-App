import { withFilter } from 'graphql-subscriptions';
import { RedisHelper } from '../../helpers/redisHelper';
import { SubscriptionConstants } from '../../constants/subscription.constants';

const pubsub = new RedisHelper().getPubSub();

const subscriptionMessageResolver = {
  newMessage: {
    subscribe: withFilter(
      () => pubsub.asyncIterator(SubscriptionConstants.NEW_MESSAGE),
      (payload, variables) => {
        return payload.receiverId === variables.receiverId;
      }
    ),
  },
}

export default subscriptionMessageResolver;