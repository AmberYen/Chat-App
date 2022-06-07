import { ResolverContext } from "../resolvers"
import { MutationResolvers } from "../../resolvers-types.generated"

const mutationMessageResolver: MutationResolvers<ResolverContext> =
  {
    async createMessage(_parent, args, { db, pubsub }) {
      const { senderId, receiverId, message } = args;

      const dbMessage = await db.createMessage(
        senderId,
        receiverId,
        message
      );

      if (pubsub) {
        pubsub.publish('new_message', {
          newMessage: dbMessage,
          receiverId
        });
      }

      return dbMessage;
    },
  }
export default mutationMessageResolver