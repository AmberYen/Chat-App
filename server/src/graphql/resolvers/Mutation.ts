import { ResolverContext } from "../resolvers"
import { MutationResolvers } from "../../resolvers-types.generated"

const mutationMessageResolver: MutationResolvers<ResolverContext> =
  {
    async createMessage(_parent, args, { db }) {
      const { senderId, receiverId, message } = args;

      const dbMessage = await db.createMessage(
        senderId,
        receiverId,
        message
      );

      return dbMessage;
    },
  }
export default mutationMessageResolver