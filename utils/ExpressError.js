class ExpressError extends Error {
  constructor(statusCode, message) {
    super(); // parent Error ko message dena zaroori hai
    this.statusCode = statusCode;
    this.message= message;
  }
}

module.exports = ExpressError; //  class ko export karna mat bhool
