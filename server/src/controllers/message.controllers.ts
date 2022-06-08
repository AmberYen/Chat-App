import { GraphQLError } from 'graphql';
import { ResolverContext } from '../graphql/resolvers';
import { SubscriptionConstants } from '../constants/subscription.constants';
import { ErrorConstants } from '../constants/errors.constants';
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

  @VerifyAuthorization
  async getUserMessages(_args: any, { db, email }: ResolverContext) {
    const user = await db.getUserByEmail(email);
    
    if (!user) {
      throw new GraphQLError(ErrorConstants.USER_NOT_FOUND);
    }

    const messages = await db.getUserMessages(user._id);

    return messages;
  }
}