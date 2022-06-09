const dotenv = require('dotenv');
dotenv.config();

import {
  ApolloServer,
} from "apollo-server-express";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import * as jwt from 'jsonwebtoken';

import { AppConstants } from "../constants/app.constants";
import resolvers from "../graphql/resolvers";

const { JWT_AUTH_SALT } = process.env;

const SCHEMA = loadSchemaSync(AppConstants.GRAPHQL_SCHEMA_PATH, {
  loaders: [new GraphQLFileLoader()],
});

const graphqlSchema = addResolversToSchema({
  schema: SCHEMA,
  resolvers
});

afterAll(done => {
  done()
})

it('should returns token with correct payload', async () => {
  const targetEmail = 'user001@example.com';
  const testServer = new ApolloServer({
    schema: graphqlSchema,
    context: () => ({ isUserLogged: true, email: ''}) // bypass auth verification
  });

  const result = await testServer.executeOperation({
    query: 'query ReturnToken($email: String!) { token(email: $email) }',
    variables: { email: targetEmail },
  });

  expect(result.errors).toBeUndefined();
  expect(result.data?.token).toBeDefined();

  // extract info from JWT token
  const payload = <{ data: string; iat: number }>(
    jwt.verify(result.data?.token, <string>JWT_AUTH_SALT)
  );

  expect(payload.data).toBe(targetEmail);
});