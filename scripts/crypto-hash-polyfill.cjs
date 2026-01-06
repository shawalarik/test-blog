// Polyfill for Node versions that lack crypto.hash (e.g., < 20.12)
const crypto = require('node:crypto');

if (typeof crypto.hash !== 'function') {
  crypto.hash = (algorithm, data, outputEncoding) => {
    const hash = crypto.createHash(algorithm);
    if (data != null) {
      if (typeof data === 'string' || Buffer.isBuffer(data) || data instanceof Uint8Array) {
        hash.update(data);
      } else {
        hash.update(String(data));
      }
    }
    const encoding = outputEncoding && typeof outputEncoding === 'string' ? outputEncoding : 'hex';
    return hash.digest(encoding);
  };
}
