import queryUserResolvers from "./resolvers/Query";
import { Resolvers } from "../resolvers-types.generated";
import Db from "../db"

export interface ResolverContext {
  db: Db
}

const resolvers: Resolvers<ResolverContext> = {
  Query: queryUserResolvers
}

export default resolvers;