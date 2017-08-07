# About

A Job Queue. 

Add your jobs there and the `.onJob` will be called whenever is possible.

Only one job will be in progress each time.

# Installation

In the root folder of you app run: 

`npm install --save dyna-job-queue`

# Usage

```
import {DynaJobQueue} from 'dyna-job-queue';

let queue = new DynaJobQueue();

queue.onJob = (job, done) => {
    // here you have the added job
    // job: {command, data} 
	
    // do something for this job
    // ...
	
    // and always call done() when you finished
    done();  
};


// somewhere in your app

queue.addJob('loadConfig', {endPoint: 'http://example.com/awesomeCondig'});
queue.addJob('loadProfile', {endPoint: 'http://example.com/awesomeProfile'});

// your `onJob` will be called for these jobs

```

# Methods

## addJob(command: string, data: any, priority: number = 1): IQJob

Adds a job and will be executed when all other jobs will be executed (FIFO) according also the priority (where is optional).

The `command` is a string that will help you to understand what is this job.

The `data` can be anything, let's say, the parameters for this job.

The `priority` is optional. Default value is 1. Smaller numbers have priority.

**example:**

```
queue.addJob('loadConfig', {endPoint: 'http://example.com/awesomeCondig'});

queue.addJob('loadImage', {endPoint: 'http://example.com/awesomeCondig'}, 2); // <-- priotity 2

```

## onJob(job: IQJob, done: () => void): void

The `onJob` is a method that you should override is order you to process the jobs.

If you don't override you will get an exception on `addJob()`.

*Note:* you have to call the `done()` when you finish otherwise the execution will stuck. It's up to you to take care of it!  

**example:**

```
queue.onJob = (job, done) => {
  switch (job.command) {
    case 'loadImage':
      fetch(job.data.endPoint)
        .then(image => {
           this.saveImage(image);
           done(); // <-- is important to call it when you finish
        })
        .catch(error => {
           console.error(`Problem fetching the image ${job.data.endPoint}`);
           done(); // <-- is important to call it when you finish!
        }
    break;
  }
};

```

## addJobCallback(callback: (done: Function) => void, priority: number = 1): IQJob

This is another way to add a job. You don't define `command` and `data` but directly the callback function you want to call. The callback will be called with only the `done: Function` as argument.

**example:**

```
// implement an anonymous function
queue.addJobCallback((done: Function) => {
  // so something special here
  done();
});

// as above, define also th priority
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

## count: number

Informative, gives the current amount of pending jobs.

# Interfaces

If you use TypeScript, `dyna-job-queue` is written also in TypeScript.

There is only one interface.

## interface IQJob 

```
{
  command: string;
  data: any;
  priority: number;
}
```
