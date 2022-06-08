const dotenv = require('dotenv');
dotenv.config();

import mongoose = require('mongoose');
import * as jwt from 'jsonwebtoken';
import Users from '../models/users';

const { DB_URL, JWT_AUTH_SALT } = process.env;
export interface VerifiedUserContext {
  isUserLogged?: boolean;
  email?: string;
}

export class MongoHelper {
  /**
   * This function returns either true of false based information present in the database via jwt
   * @param req
   */
  public async validateUser(req: any): Promise<VerifiedUserContext> {
    const token = req.headers.authorization || '';
    try {
      const payload = <{ data: string; iat: number }>(
        jwt.verify(token, <string>JWT_AUTH_SALT)
      );

      const email = payload?.data;
      return await Users.findOne({ email: email }).then((res: any) => {
        if (res) {
          return { isUserLogged: true, email: email };
        }
        return { isUserLogged: false };
      });
    } catch (error) {
      return { isUserLogged: false };
    }
  }

  /**
   * initiate the Mongo Database connection
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