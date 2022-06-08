const dotenv = require('dotenv');
dotenv.config();

import { MongoHelper } from 'helpers/mongoHelper';
import Users from '../models/users';

const mHelper = new MongoHelper();

const mockUsers = [   
  new Users({
    name: 'user001',
    email: 'user001@example.com' 
  }),
  new Users({
    name: 'user002',
    email: 'user002@example.com' 
  }),
  new Users({
    name: 'user003',
    email: 'user003@example.com' 
  }),
  new Users({
    name: 'user004',
    email: 'user004@example.com' 
  }),
]

mHelper.initiateMongoConnection();

mockUsers.map((u, index) => {
  u.save(() => {
    if (index === mockUsers.length - 1) {
      console.log("DONE!");
    }
  });
});