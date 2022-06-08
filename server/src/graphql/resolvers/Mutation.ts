import { ResolverContext } from "../resolvers"
import { MutationResolvers } from "../../resolvers-types.generated"
import { SubscriptionConstants } from '../../constants/subscription.constants';

const mutationMessageResolver: MutationResolvers<ResolverContext> = {
    async createMessage(_parent, args, { db, pubsub }) {
      const { senderId, receiverId, message } = args;

      const dbMessage = await db.createMessage(
        senderId,
        receiverId,
        message
      );

      if (pubsub) {
        pubsub.publish(SubscriptionConstants.NEW_MESSAGE, {
          newMessage: dbMessage,
          receiverId
        });
      }

      return dbMessage;
    },
}
export default mutationMessageResolver