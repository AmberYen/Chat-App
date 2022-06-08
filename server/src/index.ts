const dotenv = require('dotenv');
dotenv.config();

import * as express from 'express';
import { createServer } from "http"

import { createApolloServer } from "./graphql/apollo-server";
import Db from './db';
import { MongoHelper } from './helpers/mongoHelper';

const { PORT } = process.env;

const app = express();

// create mongo connection
const mHelper = new MongoHelper();
mHelper.initiateMongoConnection();

async function main() {
  const db = new Db();

  const httpServer = createServer(app)
  const apolloServer = await createApolloServer(
    db,
    httpServer,
    app
  )

  await new Promise<void>((resolve) =>
    httpServer.listen(PORT, () => {
      console.log(
        [
          console.log(' GraphQL API listening on   '),
          console.log(`\thttp://localhost:${PORT}${apolloServer.graphqlPath}\t`),
        ].join(' ')
      );
      resolve();
    })
  );
}

main().catch((err) => {
  console.error(err);
});