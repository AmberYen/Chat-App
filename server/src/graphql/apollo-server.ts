import { ApolloServerPluginDrainHttpServer } from "apollo-server-core"
import {
  ApolloServer,
  ExpressContext,
} from "apollo-server-express"
import * as express from "express"
import { Server } from "http"
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader"
import { loadSchemaSync } from "@graphql-tools/load"
import { addResolversToSchema } from "@graphql-tools/schema"
import { GRAPHQL_SCHEMA_PATH } from "../constants"
import Db from '../db';
import resolvers, { ResolverContext } from "./resolvers";

const SCHEMA = loadSchemaSync(GRAPHQL_SCHEMA_PATH, {
  loaders: [new GraphQLFileLoader()],
})

export async function createApolloServer(
  db: Db,
  httpServer: Server,
  app: express.Application
): Promise<ApolloServer<ExpressContext>> {
  
  const context: () => ResolverContext = () => ({ db });

  const server = new ApolloServer({
    schema: addResolversToSchema({
      schema: SCHEMA,
      resolvers
    }),
    context, 
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
  })
  await server.start()
  server.applyMiddleware({ app })
  return server
}