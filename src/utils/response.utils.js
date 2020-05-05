module.exports = (function responseUtils() {
  /**
   * Converts JSON object to a safe response
   * @returns {Object}
   */
  function makeResponse(result, statusCode = 200) {
    return {
      statusCode,
      body: JSON.stringify(result, null, 2)
    };
  }

  return {
    makeResponse,
  };
}());
  