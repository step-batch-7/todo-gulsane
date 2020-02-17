class SessionManager {
  constructor () {
    this.sessions = {};
  }

  addSession(username, sessionId) {
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
}

module.exports = {SessionManager};
