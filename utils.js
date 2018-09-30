const path = require("path");
const fs = require('fs');

const mkdirSync = (p) => {
  let dir = path.dirname(p);
  let split = dir.split(path.sep);

  for (i = 0; i <= split.length; i++) {
    let a = split.slice(0, i);
    let b = a.join(path.sep);
    if (b) {
      try {
        fs.mkdirSync(b);
      } catch (e) {
        if (e.code === 'EEXIST') { // curDir already exists!
        } else {
          throw e;
        }
      }
    }
  }
}

const exists = (p) => {
  return fs.existsSync(p);
}

const filename = (p) => {
  return path.basename(p)
}

module.exports = {
  mkdirpSync: mkdirSync,
  exists: exists,
  filename: filename
}