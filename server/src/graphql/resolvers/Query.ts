const dotenv = require('dotenv');
dotenv.config();

import * as jwt from 'jsonwebtoken';

import { QueryResolvers } from "../../resolvers-types.generated";
import { ResolverContext } from "../resolvers";

const queryUserResolvers: QueryResolvers<ResolverContext> = {
  currentUser: async (_, __, { db, email }) => { // TODO: change to controllers
    if (!email) {
      throw new Error(
        'permission denied'
      ); 
    }
    const user = await db.getUserByEmail(email);
    if (!user) {
      throw new Error(
        'user was requested, but there are no users in the database'
      );
    }
    return user;
  },
  messages: async (_, __, { db, email }) => {
    if (!email) {
      throw new Error(
        'permission denied'
      ); 
    }
    
    const user = await db.getUserByEmail(email);
    
    if (!user) {
      throw new Error(
        'user was requested, but there are no users in the database'
      );
    }

    const messages = await db.getUserMessages(user._id);

    return messages;
  },
  token: (_, args) => {
    return jwt.sign({ data: args.email }, <string>process.env.JWT_AUTH_SALT);
  },
}

export default queryUserResolvers;