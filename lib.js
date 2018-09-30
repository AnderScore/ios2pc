const libijs = require("libijs");
const utils = require("./utils");

const fetch = (afcClient, from, to, item) => {
  return new Promise((res,rej) => {
    let filename = utils.filename(item.relativeToRoot);
    let year = new Date(item.stats.st_birthtime / 1000000).getFullYear()
    let toPath = to + year + "/" + filename;

    utils.mkdirpSync(toPath);

    if (utils.exists(toPath)) {
      res();
      return;
    }

    console.log("Downloading: " + toPath);

    afcClient.downloadFile(from + item.relativeToRoot, toPath).done((a) => {
      if (!a) {
        rej(from + item.relativeToRoot);
        return;
      }

      res();
    }).catch((ex) => {
      console.log(ex);
      rej(ex);
    });
  });
}

const fetchItems = async (afcClient, items, from, to) => {
  for (let item of items) { 
    await fetch(afcClient, from, to, item);
  }
}

module.exports = {
  connect: () => {
    let promise = new Promise((resolve, reject) => {
      const deviceManager = libijs.createClient().deviceManager;
      deviceManager.ready(() => {
        let device = deviceManager.getDevice();
        resolve(device);
      });
    });
    return promise;
  },
  download: (device, from, to) => {
    let promise = new Promise((resolve, reject) => {
      libijs.services.getService(device, "afc").done((afcClient) => {
        let items = [];

        afcClient.walk(from, false, true).item((item) => { 
          items.push(item);
        }).done(() => {

          fetchItems(afcClient, items, from, to).catch((e) => {
            console.log("failed to download " + e);
            afcClient.close().done(() => {
              reject(e);
            });
          }).then(() => {
            afcClient.close().done(() => {
              resolve();
            });
          });
        });
        
      }).catch((e) => {
        reject(e);
      });
    });

    return promise;
  }
};