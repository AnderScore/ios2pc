const lib = require("./lib");

(async () => {
  try {
    let device = await lib.connect();
    await lib.download(device, "/DCIM/", "./images/");
  } catch (e) {
    console.log(e);
  }
})();