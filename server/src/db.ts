import Users, { DBUser } from './models/users';

class Db {

  async getUserById(id: string) {
    return Users.findById(id);
  }
   
};

export default Db;