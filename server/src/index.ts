const dotenv = require('dotenv');
dotenv.config();

import * as express from 'express';
import mongoose = require('mongoose');
import { createServer } from "http"

import { PORT, STATIC_ROOT_FOLDER_PATH } from './constants';
import { createApolloServer } from "./graphql/apollo-server";
import Db from './db';

const { DB_URL } = process.env;

const app = express();

mongoose.connect(DB_URL || 'mongodb://localhost/chatting-app').then(() => {
  console.log('Connected to MongoDb');
})
.catch((err: Error) => {
  throw `There is error in connecting Mongo DB ${err.message}`;
});

async function main() {
  const db = new Db();

  app.use('/static', express.static(STATIC_ROOT_FOLDER_PATH));

  const httpServer = createServer(app)
  const apolloServer = await createApolloServer(
    db,
    httpServer,
    app
  )

  await new Promise<void>((resolve) =>
    app.listen(PORT, () => {
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