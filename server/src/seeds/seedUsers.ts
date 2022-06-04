const dotenv = require('dotenv');
dotenv.config();

import mongoose = require('mongoose');
import Users from '../models/users';

const { DB_URL  } = process.env;

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

mongoose.connect(DB_URL || 'mongodb://localhost/chatting-app').then(() => {
  console.log('Connected to MongoDb');
})
.catch((err: Error) => {
  throw `There is error in connecting Mongo DB ${err.message}`;
});

mockUsers.map((u, index) => {
  u.save(() => {
    if (index === mockUsers.length - 1) {
      console.log("DONE!");
      mongoose.disconnect();
    }
  });
});