class Sessions {
  constructor () {
    this.sessions = {};
  }

  add(username, sessionId) {
    const SIDs = this.sessions[username];

    if (SIDs) {
      this.sessions[username].push(sessionId);
    } else {
      this.sessions[username] = [sessionId];
    }
  }

  hasSID(username, sessionId) {
    return this.sessions[username].some(SID => SID === sessionId);
  }

  getUsername(sessionId) {
    const usernames = Object.keys(this.sessions);
    return usernames.find(username => this.hasSID(username, sessionId));
  }

  remove(sessionId) {
    const username = this.getUsername(sessionId);
    const index = this.sessions[username].findIndex(SID => SID === sessionId);
    this.sessions[username].splice(index, 1);
  }
}

module.exports = {Sessions};

