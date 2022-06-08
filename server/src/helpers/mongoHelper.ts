const dotenv = require('dotenv');
dotenv.config();

import mongoose = require('mongoose');
import * as jwt from 'jsonwebtoken';

const User = require('../models/users');

const { DB_URL } = process.env;

export class MongoHelper {
  /**
   * This function returns either true of false based information present in the database via jwt
   * @param req
   */
  public async validateUser(req: any) {
    const token = req.headers.authorization || '';
    try {
      const payload = <{ data: string; iat: number }>(
        jwt.verify(token, <string>process.env.auth_encryption_salt)
      );
      const email = payload['data'];
      return await User.findOne({ email: email }).then((res: any) => {
        if (res && res.user) {
          return { isUserLogged: true, email: email };
        }
        return { isUserLogged: false };
      });
    } catch (error) {
      return { isUserLogged: false };
    }
  }

  /**
   * This function will initiate the Mongo Database connection
   */
  public initiateMongoConnection(): void {
    (<any>mongoose).Promise = global.Promise;
    mongoose
      .connect(DB_URL || 'mongodb://localhost/chatting-app')
      .then(() => {
        console.log('Connected to MongoDb');
      })
      .catch((err: Error) => {
        throw `There is error in connecting Mongo DB ${err.message}`;
      });
  }
}