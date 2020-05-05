const AWS = require('aws-sdk');
const stream = require('stream');

AWS.config.update({ region: process.env.REGION || 'us-east-1' });

class S3Helper {
  constructor() {
    this.s3 = new AWS.S3();
  }

  getUploadURL({ Bucket, Key }) {
    console.info('getUploadURL started');
    const s3Params = {
      Bucket,
      Key,
      ContentType: 'text/plain',
      CacheControl: 'max-age=311s04000',
    };

    return this.s3.getSignedUrlPromise('putObject', s3Params);
  }

  getReadableStream({ Bucket, Key }) {
    return this.s3.getObject({ Bucket, Key }).createReadStream();
  }

  getWritableStream() {
    return new stream.PassThrough();
  }

  upload({ Bucket, Key }, readStream, cb) {
    const params = { Bucket, Key, Body: readStream };
    this.s3.upload(params, cb);
  }
}

// Create a singleton
const s3HelperInstance = new S3Helper();
module.exports = s3HelperInstance;
