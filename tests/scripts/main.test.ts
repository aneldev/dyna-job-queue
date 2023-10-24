import "jest";

import {count} from "dyna-count";

import {DynaJobQueue} from '../../src';

// help: https://facebook.github.io/jest/docs/expect.html

describe('Dyna Job Queue - using addJobCallback()', () => {

  let queue = new DynaJobQueue();
  const testCollectedData: string[] = [];


  it('expects the pending jobs should 0', () => {
    expect(queue.stats.jobs).toBe(0);
  });

  it(`should push 10 jobs`, () => {
    count(10).for((index: number) => {
      queue.addJobCallback((done: () => undefined) => {
        testCollectedData.push(`start ${index}`);
        setTimeout(() => {
          testCollectedData.push(`end ${index}`);
          done();
        }, 300);
      });
    });
  });

  it(`expects the pending jobs to be 9 and one is started to working`, () => {
    expect(queue.stats.jobs).toBe(9);
    expect(testCollectedData.length).toBe(1);
  });

  it(`should pick last 10 job in correct order`, (done: () => undefined) => {
    setTimeout(() => {
      const expected: string[] =
        count(10)
          .reduce((acc: string[], index: number) => {
            acc.push(`start ${index}`);
            acc.push(`end ${index}`);
            return acc;
          }, []);
      expect(JSON.stringify(testCollectedData, null, 2))
        .toBe(JSON.stringify(expected, null, 2));
      done();
    }, (10 * 300) + 500);
  });

  it('expects the pending jobs should 0', () => {
    expect(queue.stats.jobs).toBe(0);
  });

});

describe('Dyna Job Queue - using addJobPromise()', () => {
  let queue = new DynaJobQueue();
  const testCollectedData: any[] = [];

  it(`should push 10 jobs`, (done: () => undefined) => {
    for (let i: number = 0; i < 10; i++) {
      queue.addJobPromise((resolve) => {
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

describe('Dyna Job Queue - using addJobPromised()', () => {
  let queue = new DynaJobQueue();
  const testCollectedData: any[] = [];

  it(`should push 10 jobs`, (done: () => undefined) => {
    for (let i: number = 0; i < 10; i++) {
      queue.addJobPromised(() => {
        return new Promise((resolve: (date: any) => void) => {
          setTimeout(() => {
            let data: any = {index: i};
            testCollectedData.push(data);
            expect(queue.isWorking).toBe(true);
            resolve(data);
          }, 100);
        });
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

describe('Dyna Job Queue - using parallels', () => {
  let queue = new DynaJobQueue({parallels: 3});
  let times: { [index: string]: number };

  it('should push 5 jobs', (done: () => undefined) => {
    times = {};
    const now: number = Number(new Date);
    const getNow = (): number => Number(new Date) - now;
    count(5).for((index: number) => {
      queue.addJobPromise((resolve) => {
        times[index] = getNow();
        setTimeout(resolve, 1000);
      });
    });
    setTimeout(done, 2100);
  });

  it('should have the correct times', () => {
    expect(times[0] < 500).toBe(true);
    expect(times[1] < 500).toBe(true);
    expect(times[2] < 500).toBe(true);
    expect(times[3] > 1000).toBe(true);
    expect(times[4] > 1000).toBe(true);
  });

  it('should push 5 jobs (again)', (done: () => undefined) => {
    times = {};
    const now: number = Number(new Date);
    const getNow = (): number => Number(new Date) - now;
    count(5).for((index: number) => {
      queue.addJobPromise((resolve) => {
        times[index] = getNow();
        setTimeout(resolve, 1000);
      });
    });
    setTimeout(done, 1100);
  });

  it('should have the correct times', () => {
    expect(times[0] < 500).toBe(true);
    expect(times[1] < 500).toBe(true);
    expect(times[2] < 500).toBe(true);
    expect(times[3] > 1000).toBe(true);
    expect(times[4] > 1000).toBe(true);
  });
});

describe('Dyna Job Queue - jobFunction', () => {
  let queue = new DynaJobQueue({parallels: 3});

  class NewsFeeder {
    private readonly feeds: number[] = [];

    constructor() {
      this.addFeed = queue.jobFactory(this.addFeed.bind(this));
    }

    public addFeed(feed: number, afterDelay: number): Promise<number> {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.feeds.push(feed);
          resolve(feed);
        }, afterDelay);
      });
    }

    public getFeeds(): number[] {
      return this.feeds;
    }

    public clearFeeds(): void {
      while (this.getFeeds().pop()) {
      }
    }
  }

  const newsFeeder = new NewsFeeder();

  it('adds an item to the feeder', (done: () => undefined) => {
    newsFeeder.addFeed(12, 200)
      .then(() => newsFeeder.getFeeds())
      .then(feeds => {
        expect(feeds.length).toBe(1);
        expect(feeds[0]).toBe(12);
        newsFeeder.clearFeeds();
        done();
      })
  });

  it('adds items with different delay', (done: () => undefined) => {
    Promise.all([
      newsFeeder.addFeed(110, 100),
      newsFeeder.addFeed(105, 200),
      newsFeeder.addFeed(100, 2),
    ])
      .then((executed) => {
        expect(executed.join()).toBe("110,105,100");
        expect(newsFeeder.getFeeds().join()).toBe("100,110,105");
        done();
      });
  });
});

describe('Dyna Job Queue - allDone() at the end', () => {
  const queue = new DynaJobQueue({parallels: 1});
  let text = "";

  let addText = (subText: string) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        text += subText;
        resolve();
      }, 200)
    });
  };
  addText = queue.jobFactory(addText);

  it('the allDone() is called on time', async () => {
    addText('1');
    addText('2');
    addText('3');
    await queue.allDone();
    text += 'Done';
    expect(text).toBe('123Done');
  });

});

describe('Dyna Job Queue - allDone() after first job', () => {
  const queue = new DynaJobQueue({parallels: 1});
  let text = "";

  let addText = (subText: string) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        text += subText;
        resolve();
      }, 200)
    });
  };
  addText = queue.jobFactory(addText);

  it('the allDone() is called on time', (done) => {
    addText('1');
    queue.allDone()
      .then(() => {
        text += 'Done';
        expect(text).toBe('123Done');
        done();
      });
    addText('2');
    addText('3');
  });

});

describe('Dyna Job Queue - jobFactory massive calls', () => {
  const queue = new DynaJobQueue({parallels: 1});
  let collection: string[] = [];

  let addText = async (text: string) => {
    collection.push(text);
    await new Promise(r => setTimeout(r, 0))
  };

  addText = queue.jobFactory(addText);

  it('the jobs are called quickly on massive calls', async () => {
    const started = Date.now();

    await new Promise(r => setTimeout(r, 100));

    await Promise.all(
      count(20)
        .map(index => addText(`id-${index}`))
    );

    await new Promise(r => setTimeout(r, 100));

    await Promise.all(
      count(20)
        .map(index => addText(`id-${index}`))
    );

    const ended = Date.now();

    const elapsed = ended - started;
    console.log('Elapsed', elapsed);

    expect(elapsed).toBeLessThan(500);
    expect(collection).toMatchSnapshot();
  });

});


describe('Test output of the addJobPromised', () => {
  it('Parallel 1', async () => {
    const queue = new DynaJobQueue({parallels: 1});
    const fileNames = getRowArray(5).map(n => String(n + 1));
    const uploadedFiles: string[] = [];

    await Promise.all(
      fileNames
        .map(fileName  => queue.addJobPromised(() => uploadFile(fileName, uploadedFiles)))
    );

    expect(uploadedFiles).toMatchSnapshot('Uploaded files');
  });

  const uploadFile = async (fileName: string, files: string[]): Promise<string> => {
    console.debug('Uploading file', fileName);
    await new Promise(r => setTimeout(r, 200));
    files.push(fileName + '.txt');
    return 'Uploading file ' + fileName + ' completed';
  };

  const getRowArray = (count: number): number[] =>
    Array(count)
      .fill(null)
      .map((v, index) => {
        v; // 4TS
        return index;
      });
});
