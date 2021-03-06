import Users from './models/users';
import Message from './models/message';
class Db {
  async getUserByEmail(email: string) {
    return Users.findOne({ email });
  }
  async getUserMessages(id: string) {
    return Message.find({ senderId: id});
  }
  async createMessage(senderId: string, receiverId: string, message: string) {
    const userText = new Message({
      senderId,
      receiverId,
      message
    });

    await userText.save();
    return userText;
  } 
};

export default Db;