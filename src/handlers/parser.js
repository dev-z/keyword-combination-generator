/**
 * Receives an Amazon S3 ObjectCreated event input and processes the file details that it contains
 */
const s3Helper = require('./../utils/s3.utils');
const { parseFile } = require('./../utils/file.utils');
const { printCombination } = require('./../utils/combinator.utils');
const { makeResponse } = require('./../utils/response.utils');

const { ERROR_CODES } = require('./../constants');

module.exports.handler = (event, context, callback) => {
  console.info('File parsing started...');
  event.Records.forEach((record) => {
    const { bucket, object } = record.s3;
    console.info(`Parsing ${object.key} in ${bucket.name}`);
    const readable = s3Helper.getReadableStream({ Bucket: bucket.name, Key: object.key });
    const writable = s3Helper.getWritableStream();
    const uploadStream = parseFile(readable, writable, printCombination);
    s3Helper.upload(
      { Bucket: process.env.DOWNLOAD_BUCKET, Key: object.key },
      uploadStream,
      (err, data) => {
        if (err) {
          console.error(ERROR_CODES.S3_WRITE_ERROR, err);
        } else {
          console.info('Record successfully written to s3', data);
        }
      });
  });
};
