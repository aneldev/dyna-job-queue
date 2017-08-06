declare let jasmine: any, describe: any, expect: any, it: any;
if (typeof jasmine !== 'undefined') jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

import {DynaJobQueue, IQJob} from '../src';

// help: https://facebook.github.io/jest/docs/expect.html

let executedJobs: IQJob[] = [];

let queue = new DynaJobQueue();

// this simulates a worker for this jobs, for the test we push these jobs to executedJobs array
queue.onJob = (job: IQJob, done: () => void) => {
  setTimeout(() => {
    executedJobs.push(job);
    done();
  }, 100);
};

const getLastExecutedJob = (): IQJob => executedJobs[executedJobs.length - 1];

describe('Dyna Job Queue', () => {

  it('should push one job', () => {
    let job: IQJob = queue.addJob('loadConfig', {endPoint: 'http://example.com/awesomeCondig', _debugJonNo: 1});
    expect(job.command).toBe('loadConfig');
    expect(job.data._debugJonNo).toBe(1);
    expect(queue.count).toBe(1);
  });

  it('should pick the job', (done: Function) => {
    setTimeout(() => {
      let job: IQJob = getLastExecutedJob();
      expect(job.command).toBe('loadConfig');
      expect(job.data._debugJonNo).toBe(1);
      expect(queue.count).toBe(0);
      done();
    }, 200);
  });

  const testForJobs: number = 100;

  it(`should push ${testForJobs} jobs`, () => {
    let ok: boolean = true;
    for (let i: number = 0; i < testForJobs; i++) {
      ok = ok && !!queue.addJob('loadData', {endPoint: 'http://example.com/awesomeData', _testId: `id-${i}`});
    }
    expect(ok).toBe(true);
  });

  it(`should pick last ${testForJobs} job in correct order`, (done: Function) => {
    setTimeout(() => {
      let lastJobs: IQJob[] = executedJobs.slice(-testForJobs);
      lastJobs.forEach((job: IQJob, index: number) => {
        expect(job.command).toBe('loadData');
        expect(job.data._testId).toBe(`id-${index}`);
      });
      done();
    }, (testForJobs*100)+100);
  });

  it('pending jobs should 0', () => {
    expect(queue.count).toBe(0);
  });


});
