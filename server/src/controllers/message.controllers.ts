import { ResolverContext } from '../graphql/resolvers';
import { SubscriptionConstants } from '../constants/subscription.constants';
import { VerifyAuthorization } from '../decorators/auth.decorators';

export class MessageControllers {
  @VerifyAuthorization
  async createMessage(args: any, { db, pubsub }: ResolverContext) {
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
  }
}