const { makeResponse } = require('./../utils/response.utils');

module.exports.handler = async (event) => {
  return makeResponse({
    message: 'Go Serverless v1.0! Your function executed successfully!',
    input: event,
  });
};
