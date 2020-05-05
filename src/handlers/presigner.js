const { v4: uuidv4 } = require('uuid');

const s3Helper = require('./../utils/s3.utils');
const { makeResponse } = require('./../utils/response.utils');

const { ERROR_CODES } = require('./../constants');

module.exports.handler = (event, context, callback) => {
  const bucket = process.env.UPLOAD_BUCKET;
  if (!bucket) {
    throw new TypeError('Bucket name is undefined', 'presigner.js', 5);
  }
  let key = '';
  try {
    // Check if a filename was passed in query params
    key = event.queryStringParameters.filename;
  } catch (err) {
    // if filename is not present, generate a random one
    const actionId = uuidv4();
    key = `${actionId}.txt`;
  }
  s3Helper
    .getUploadURL({ Bucket: bucket, Key: key })
    .then((result) => {
      callback(null, makeResponse({
        data: {
          uploadURL: result,
          filename: key,
        },
      }));
    }).catch((error) => {
      const errorCode = ERROR_CODES.PRESIGN_ERROR;
      console.error(errorCode, error);
      callback(null, makeResponse({
        success: false,
        message: 'Error in genrating pre-signed URL',
        errorCode,
      }, 400));
    });
};
