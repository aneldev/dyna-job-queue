declare let jasmine: any, describe: any, expect: any, it: any;
if (typeof jasmine !== 'undefined') jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

import {DynaJobQueue, IQJob} from '../../src/index';

// help: https://facebook.github.io/jest/docs/expect.html

describe('Dyna Job Queue - using addJobCallback()', () => {

  let queue = new DynaJobQueue();
  const testForCBJobs: number = 10;
  const testCollectedData: any[] = [];

  it('expects the pending jobs should 0', () => {
    expect(queue.stats.jobs).toBe(0);
  });

  it(`should push ${testForCBJobs} jobs`, () => {
    let ok: boolean = true;
    for (let i: number = 0; i < testForCBJobs; i++) {
      ok = ok && !!queue.addJobCallback((done: Function) => {
          setTimeout(() => {
            testCollectedData.push({index: i});
            done();
          }, 100);
        }
      );
    }
    expect(ok).toBe(true);
  });

  it(`expects the pending jobs to be ${testForCBJobs}`, () => {
    expect(queue.stats.jobs).toBe(testForCBJobs);
  });

  it(`should pick last ${testForCBJobs} job in correct order`, (done: Function) => {
    setTimeout(() => {
      testCollectedData.forEach((data: any, index: number) => {
        expect(data.index).toBe(index);
      });
      done();
    }, (testForCBJobs * 100) + 400);
  });

  it('expects the pending jobs should 0', () => {
    expect(queue.stats.jobs).toBe(0);
  });

});

describe('Dyna Job Queue - using addJobPromise()', () => {

  let queue = new DynaJobQueue();
  const testForCBJobs: number = 10;
  const testCollectedData: any[] = [];

  it(`should push ${testForCBJobs} jobs`, (done: Function) => {
    for (let i: number = 0; i < testForCBJobs; i++) {
      queue.addJobPromise((resolve: Function, reject: Function) => {
        setTimeout(() => {
          let data: any = {index: i};
          testCollectedData.push(data);
          expect(queue.isWorking).toBe(true);
          resolve(data);
        }, 100);
      }, 2)
        .then((data: any) => {
          let lastIndexValue: number = testCollectedData[testCollectedData.length - 1].index;
          expect(lastIndexValue).toBe(i);
          expect(data.index).toBe(i);
          if (lastIndexValue == 9) expect(queue.isWorking).toBe(false);
          if (lastIndexValue == 9) done();
        });
    }
  });

  it('expects the pending jobs should 0', () => {
    expect(queue.stats.jobs).toBe(0);
  });

});
