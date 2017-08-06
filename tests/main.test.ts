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

describe('Dyna Job Queue - using addJob()', () => {

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
    }, (testForJobs*100)+400);
  });

  it('pending jobs should 0', () => {
    expect(queue.count).toBe(0);
  });

  it('should ass job with priority', () => {
    let ok: boolean = true;
    ok = ok && !!queue.addJob('addTodo', {desc: 'Implement this', _debugId: 5}, 8);
    ok = ok && !!queue.addJob('addTodo', {desc: 'Implement this', _debugId: 6}, 8);
    ok = ok && !!queue.addJob('addTodo', {desc: 'Implement this', _debugId: 3}, 2);
    ok = ok && !!queue.addJob('addTodo', {desc: 'Implement this', _debugId: 2}, 1);
    ok = ok && !!queue.addJob('addTodo', {desc: 'Implement this', _debugId: 0}, 0);
    ok = ok && !!queue.addJob('addTodo', {desc: 'Implement this', _debugId: 9}, 11);
    ok = ok && !!queue.addJob('addTodo', {desc: 'Implement this', _debugId: 1}, 0);
    ok = ok && !!queue.addJob('addTodo', {desc: 'Implement this', _debugId: 7}, 10);
    ok = ok && !!queue.addJob('addTodo', {desc: 'Implement this', _debugId: 4}, 3);
    ok = ok && !!queue.addJob('addTodo', {desc: 'Implement this', _debugId: 8}, 10);
    expect(!!ok).toBe(true);
  });

  it('should pick the job in correct order', (done: Function) => {
    setTimeout(() => {
      let lastJobs: IQJob[] = executedJobs.slice(-10);
      lastJobs.forEach((job: IQJob, index: number) => {
        expect(job.command).toBe('addTodo');
        expect(job.data._debugId).toBe(index);
      });
      done();
    }, 1300);
  });

});

describe('Dyna Job Queue - using addJobCallback()', () => {

  const testForJobs: number = 10;
  const testCollectedData: any[] = [];

  it('expects the pending jobs should 0', () => {
    expect(queue.count).toBe(0);
  });

  it(`should push ${testForJobs} jobs`, () => {
    let ok: boolean = true;
    for (let i: number = 0; i < testForJobs; i++) {
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

  it(`expects the pending jobs to be ${testForJobs}`, () => {
    expect(queue.count).toBe(testForJobs);
  });

  it(`should pick last ${testForJobs} job in correct order`, (done: Function) => {
    setTimeout(() => {
      testCollectedData.forEach((data: any, index: number) => {
        expect(data.index).toBe(index);
      });
      done();
    }, (testForJobs * 100) + 400);
  });

  it('expects the pending jobs should 0', () => {
    expect(queue.count).toBe(0);
  });

});
