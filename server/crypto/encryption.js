const crypto = require('crypto')

const algorithm = "AES-256-ctr";
const iv = Buffer.from("00000000000000000000000000000000", "hex");

const encryption = (buffer, key) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const result = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return result;
};

module.exports = encryption