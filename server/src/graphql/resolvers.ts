import queryUserResolvers from "./resolvers/Query";
import mutationMessageResolver from "./resolvers/Mutation";
import { Resolvers } from "../resolvers-types.generated";
import Db from "../db"

export interface ResolverContext {
  db: Db
  isUserLogged: boolean
  email?: string
}

const resolvers: Resolvers<ResolverContext> = {
  Query: queryUserResolvers,
  Mutation: mutationMessageResolver
}

export default resolvers;