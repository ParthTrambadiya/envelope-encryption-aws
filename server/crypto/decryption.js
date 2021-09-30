const crypto = require('crypto')

const algorithm = "AES-256-ctr";
const iv = Buffer.from("00000000000000000000000000000000", "hex");

const decryption = (cipherBuffer, key) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const result = Buffer.concat([
      decipher.update(cipherBuffer),
      decipher.final(),
    ]);
    return result;
};

module.exports = decryption