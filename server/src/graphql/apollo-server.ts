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
import { GRAPHQL_SCHEMA_PATH } from "../constants"
import Db from '../db';
import resolvers, { ResolverContext } from "./resolvers";

// db schema
import Users from "../models/users";

const SCHEMA = loadSchemaSync(GRAPHQL_SCHEMA_PATH, {
  loaders: [new GraphQLFileLoader()],
})

export async function createApolloServer(
  db: Db,
  httpServer: Server,
  app: express.Application
): Promise<ApolloServer<ExpressContext>> {
  
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
          return { isUserLogged: true, email: email, db };
        }
        return { isUserLogged: false, db };
      });
    } catch (error) {
      return { isUserLogged: false, db };
    }
  };

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