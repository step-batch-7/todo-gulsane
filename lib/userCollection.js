const {User} = require('./user');

class UserCollection {
  constructor (userList) {
    this.userList = userList;
  }

  findUser(username) {
    return this.userList.find(user => user.username === username);
  }

  verifyUser(username, password) {
    const user = this.findUser(username);
    return user ? user.verifyPassword(password) : false;
  }

  addUser(userDetail) {
    const user = User.load(userDetail);
    this.userList.push(user);
  }

  getUserFullName(username) {
    const user = this.findUser(username);
    return user.userFullName;
  }

  isAvailable(username) {
    const user = this.findUser(username);
    return user ? false : true;
  }

  toJSON() {
    return JSON.stringify(this.userList);
  }

  save(writer) {
    writer(this.toJSON());
  }

  static load(list) {
    const userList = list.map(userDetail => User.load(userDetail));
    return new UserCollection(userList);
  }
}

module.exports = {UserCollection};
