const fs = require('fs');
const path = require('path');

const aliasDirsSync = (searchDir) => {
  const obj = {};
  fs.readdirSync(searchDir)
    .filter((file) => fs.statSync(`${searchDir}/${file}`).isDirectory())
    .forEach((dir) => {
      obj[dir] = path.resolve(searchDir, dir);
    });
  return obj;
};

// This config is used to map our webpack aliases.
// It's used by .eslintrc.json and kyt.config.js.
module.exports = {
  resolve: {
    alias: aliasDirsSync('./src'),
  },
};
