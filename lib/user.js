class User {
  constructor (name, username, password) {
    this.name = name;
    this.username = username;
    this.password = password;
  }

  verifyPassword(password) {
    return this.password === password;
  }

  static load(userDetail) {
    const {name, username, password} = userDetail;
    return new User(name, username, password);
  }
}

module.exports = {User};
