const es = require('event-stream');

module.exports = (function fileUtil() {
  /**
   * Returns the content type of the incoming request
   * @param {Object} event AWS Lambda event object
   */
  function getContentType(event) {
    const contentType = event.headers['Content-Type'];
    if (!contentType) {
      return event.headers['content-type'];
    }
    return contentType;
  }

  /**
   * Analyzes a file name and returns whether the file type is valid or not
   * @param {String} filename File name
   * @returns {Boolean}
   */
  function isFileTypeValid(filename) {
    const supportedFileTypes = ['txt'];
    const fnameParts = filename.split('.');
    const ext = fnameParts[fnameParts.length - 1];
    return (supportedFileTypes.includes(ext));
  }

  /**
   * Parses the incoming file
   * @param {stream.Readable} readable The file which needs to be parsed
   * @param {stream.Writable} writable The file which needs to be parsed
   * @returns {stream.Writable}
   */
  function parseFile(readable, writable, combinator) {
    readable
      .pipe(es.split())
      .pipe(es.mapSync((line) => {
        const arr = line.split(', ');
        const sizes = [];
        for (let i = 2; i <= arr.length; i += 1 ) {
          sizes.push(i);
        }
        const results = combinator(arr, sizes);
        const joined = results.reduce((acc, val) => {
          const line = val.join(' ');
          return (acc + line + '\r\n');
        }, '');
        return joined;
      }))
      .pipe(writable);
    return writable;
  }

  return {
    parseFile,
    getContentType,
    isFileTypeValid,
  };
}());
