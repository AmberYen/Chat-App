const dotenv = require('dotenv');
dotenv.config();

import * as express from 'express';
import mongoose = require('mongoose');

import { PORT, STATIC_ROOT_FOLDER_PATH } from './constants';

const { DB_URL  } = process.env;

const app = express();

mongoose.connect(DB_URL || 'mongodb://localhost/chatting-app').then(() => {
  console.log('Connected to MongoDb');
})
.catch((err: Error) => {
  throw `There is error in connecting Mongo DB ${err.message}`;
});

async function main() {
  app.use('/static', express.static(STATIC_ROOT_FOLDER_PATH));

  await new Promise<void>((resolve) =>
    app.listen(PORT, () => {
      console.log(
        [
          console.log(' GraphQL API listening on   '),
          console.log(`\thttp://localhost:${PORT}${''}\t`),
        ].join(' ')
      );
      resolve();
    })
  );
}

main().catch((err) => {
  console.error(err);
});