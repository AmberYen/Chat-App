import { QueryResolvers } from "../../resolvers-types.generated";
import { ResolverContext } from "../resolvers";

const queryUserResolvers: QueryResolvers<ResolverContext> = {
  currentUser: async (_, __, { db }) => {
    const user = await db.getUserById("629b631bca58aacf50fba7bb");
    if (!user) {
      throw new Error(
        'user was requested, but there are no users in the database'
      );
    }
    return user;
  },
  messages: () => {
    return [{
      message: "hi",
    }, {
      message: "How are you?"
    }]
  },
}

export default queryUserResolvers;