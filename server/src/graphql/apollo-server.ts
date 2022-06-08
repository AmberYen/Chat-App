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

import { AppConstants } from "../constants/app.constants";
import Db from '../db';
import resolvers, { ResolverContext } from "./resolvers";
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { MongoHelper, VerifiedUserContext } from "../helpers/mongoHelper";
import { RedisHelper } from "../helpers/redisHelper";

const mHelper = new MongoHelper();
const rHelper = new RedisHelper();

const pubsub = rHelper.getPubSub();

const SCHEMA = loadSchemaSync(AppConstants.GRAPHQL_SCHEMA_PATH, {
  loaders: [new GraphQLFileLoader()],
})

export async function createApolloServer(
  db: Db,
  httpServer: Server,
  app: express.Application
): Promise<ApolloServer<ExpressContext>> {
  const graphqlSchema = addResolversToSchema({
    schema: SCHEMA,
    resolvers
  });

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // WebSocketServer start listening.
  const serverCleanup = useServer({ schema: graphqlSchema }, wsServer); 
  
  const context: ({ req }: any) => Promise<ResolverContext|VerifiedUserContext> = async ({ req }: any) => {
    // verify user
    const verifiedInfo = await mHelper.validateUser(req);

    if (verifiedInfo.isUserLogged) {
      return { ...verifiedInfo, db, pubsub };
    } else {
      return verifiedInfo;
    }
  };

  const server = new ApolloServer({
    schema: graphqlSchema,
    context, 
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  })
  await server.start()
  server.applyMiddleware({ app })
  return server
}