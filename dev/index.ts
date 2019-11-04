import "dyna-node-console";
import "../dyna/unhandledPromiseRejections";

import {DynaJobQueue} from "../src";

(async () => {
  const queue = new DynaJobQueue({});

  Array(1).fill(null).forEach((v, index) => {
    console.time(`Process to call #${index}`);
    queue.addJobPromised(() => {
      return new Promise(resolve=>{
        console.debug(`This is job #${index}`);
        console.timeEnd(`Process to call #${index}`);
        resolve();
      });
    });
  });

  Array(0).fill(null).forEach((v, index) => {
    console.time(`Process to call by addJobCallback #${index}`);
    queue.addJobCallback(done => {
      console.debug(`This is job #${index}`);
      console.timeEnd(`Process to call by addJobCallback #${index}`);
      done();
    });
  });
})();
