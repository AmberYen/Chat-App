const dotenv = require('dotenv');
dotenv.config();

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
import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as Redis from 'ioredis';

import { AppConstants } from "../constants/app.constants";
import Db from '../db';
import resolvers, { ResolverContext } from "./resolvers";
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { MongoHelper, VerifiedUserContext } from "../helpers/mongoHelper";

const mHelper = new MongoHelper();

const SCHEMA = loadSchemaSync(AppConstants.GRAPHQL_SCHEMA_PATH, {
  loaders: [new GraphQLFileLoader()],
})
declare var process : {
  env: {
    REDIS_DOMAIN_NAME: string,
    JWT_AUTH_SALT: string,
  }
}

const options = {
  host: process.env.REDIS_DOMAIN_NAME || '',
  port: 6379,
};

const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options)
});

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