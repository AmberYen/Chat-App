import queryUserResolvers from "./resolvers/Query";
import mutationMessageResolver from "./resolvers/Mutation";
import subscriptionMessageResolver from "./resolvers/SubScription";
import Db from "../db"
import { RedisPubSub } from "graphql-redis-subscriptions";

export interface ResolverContext {
  db: Db
  isUserLogged: boolean
  email: string
  pubsub: RedisPubSub
}

// TODO: fix type check issue here
const resolvers = {
  Query: queryUserResolvers,
  Mutation: mutationMessageResolver,
  Subscription: subscriptionMessageResolver
}

export default resolvers;