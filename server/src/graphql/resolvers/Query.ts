const dotenv = require('dotenv');
dotenv.config();

import * as jwt from 'jsonwebtoken';

import { QueryResolvers } from "../../resolvers-types.generated";
import { ResolverContext } from "../resolvers";
import { UserControllers } from '../../controllers/user.controllers';
import { MessageControllers } from '../../controllers/message.controllers';

const userControllers = new UserControllers();
const messageControllers = new MessageControllers();

const queryUserResolvers: QueryResolvers<ResolverContext> = {
  currentUser: async (_, args, ctx) => { // TODO: change to controllers
    return userControllers.currentUser(args, ctx);
  },
  messages: async (_, args, ctx) => {
    return messageControllers.getUserMessages(args, ctx); 
  },
  token: (_, args) => {
    return jwt.sign({ data: args.email }, <string>process.env.JWT_AUTH_SALT);
  },
}

export default queryUserResolvers;