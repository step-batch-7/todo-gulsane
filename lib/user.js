class User {
  constructor (name, username, password, SIDs) {
    this.name = name;
    this.username = username;
    this.password = password;
    this.SIDs = SIDs;
  }

  verifyPassword(password) {
    return this.password === password;
  }

  addSID(SID) {
    this.SIDs.push(SID);
  }

  hasSID(userSID) {
    return this.SIDs.some(SID => SID === userSID);
  }

  static load(userDetail) {
    const {name, username, password, SIDs} = userDetail;
    return new User(name, username, password, SIDs);
  }
}

module.exports = {User};
