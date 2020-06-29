class AuthenticacionError extends Error {
  constructor() {
    super();
    this.message = 'ID doesn\'t exist or wrong password';
    this.name = 'E_WRONG_ID_OR_PASSWORD';
  }
}

module.exports = AuthenticacionError;
