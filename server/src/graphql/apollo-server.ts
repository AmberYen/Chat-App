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
import * as jwt from 'jsonwebtoken'
import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as Redis from 'ioredis';

import { AppConstants } from "../constants/app.constants";
import Db from '../db';
import resolvers, { ResolverContext } from "./resolvers";
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

// db schema
import Users from "../models/users";

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
  
  const context: ({ req }: any) => Promise<ResolverContext> = async ({ req }: any) => {
    // verify user
    const token = req.headers.authorization || '';
    
    try {
      const payload = <{ data: string; iat: number }>(
        jwt.verify(token, <string>process.env.JWT_AUTH_SALT)
      );
      const email = payload['data'];
      // TODO: refactor
      return await Users.find({ email: email }).then((response: any) => {
        if (response.length > 0) {
          return { isUserLogged: true, email: email, db, pubsub };
        }
        return { isUserLogged: false, db };
      });
    } catch (error) {
      return { isUserLogged: false, db };
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