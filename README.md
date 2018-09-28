# About

A Job Queue. 

Add your jobs there and the `.onJob` will be called whenever is possible.

Only one job will be in progress each time.

# Installation

In the root folder of you app run: 

`npm install --save dyna-job-queue`

# Methods

## constructor(config: IDynaJobQueueConfig)

```
interface IDynaJobQueueConfig {
  parallels?: number;       // default 1, the number of the parallel jobs
}
```

## addJob(command: string, data: any, priority: number = 1): void

Adds a job and will be executed when all other jobs will be executed (FIFO) according also the priority (where is optional).

The `command` is a string that will help you to understand what is this job.

The `data` can be anything, let's say, the parameters for this job.

The `priority` is optional. Default value is 1. Smaller numbers have priority.

**example:**

```
queue.addJob('loadConfig', {endPoint: 'http://example.com/awesomeCondig'});

queue.addJob('loadImage', {endPoint: 'http://example.com/awesomeCondig'}, 2); // <-- priotity 2

```

## addJobCallback(callback: (done: Function) => void, priority: number = 1): void

This is another way to add a job. You don't define `command` and `data` but directly the callback function you want to call. The callback will be called with only the `done: Function` as argument.

**example:**

```
// implement an anonymous function
queue.addJobCallback((done: Function) => {
  // so something special here
  done();
});

// as above, define also the priority
queue.addJobCallback((done: Function) => {
  // so something special here
  done();
}, 2);  // <-- priority 2!

// use an already implemented function
queue.addJobCallback(this.processMyJob, 2);  // <-- priority 2!
```

## addJobPromise(callback: (resolve: Function, reject: Function) => void, priority: number = 1): Promise<any>

This method adds a job with callback and returns a Promise. The callback provides two functions, the `resolve` and the `reject` when will fulfill the Promise. In `resolve` pass the output of the Promise.

The difference with the callback of other methods is that you have to call the `resolve` or `reject` instead of `done`; that's all!  

So this method is a Promise generator. The benefit is that you can get the Promise that will be fulfilled on the proper time.
 
**example:**

```
queue.addJobPromise((resolve: Function, reject: Function) => {
  try{
    // do some work here
    resolve(data);    
  } catch (err) {
    reject(err);
  }
}, 2) // <-- this 2 is the priority
  .then((data: any) => {
    // our resloved data are here
  })
  .catch((err: any)) => {
    // our exception is dropped here
  });
```


# Properties

## stats: { jobs: number, running: number}}

`jobs` is the number of the jobs that pending

`running` the number of parallel running jobs

Note: it is possible to have `jobs` but not `running` in the rare case of switching the jobs. 


