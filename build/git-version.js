// Can be accessed with https://github.com/allinbits/demeris/commits/<hash>

module.exports = () => {
  // Short commit hash
  const command = `git rev-parse --short HEAD`;
  const buffer = require('child_process').execSync(command);
  return buffer.toString();
};
