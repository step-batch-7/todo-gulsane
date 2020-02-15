class UsersDataStore {
  constructor (reader, writer, path) {
    this.reader = reader;
    this.writer = writer;
    this.path = path;
  }

  readUsersData() {
    return this.reader(this.path, 'utf8');
  }

  initialize() {
    this.usersData = JSON.parse(this.readUsersData());
  }

  getUserData(username) {
    return this.usersData[username];
  }

  updateUserData(username, data) {
    this.usersData[username] = data;
    this.writeUsersData();
  }

  toJSON() {
    return JSON.stringify(this.usersData);
  }

  writeUsersData() {
    this.writer(this.path, this.toJSON());
  }
}

module.exports = {UsersDataStore};
