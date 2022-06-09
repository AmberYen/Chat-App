import { GraphQLError } from 'graphql';
import { ResolverContext } from '../graphql/resolvers';
import { ErrorConstants } from '../constants/errors.constants';
import { VerifyAuthorization } from '../decorators/auth.decorators';

export class UserControllers {
  @VerifyAuthorization
  async currentUser(_args: any, { db, email }: ResolverContext) {
    const user = await db.getUserByEmail(email);

    if (!user) {
      throw new GraphQLError(ErrorConstants.USER_NOT_FOUND);
    }
    
    return user;
  }
}