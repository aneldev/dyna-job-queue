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

## addJob(command: string, data: any): IQJob

Adds a job and will be executed when all other jobs will be executed (FIFO).

The `command` is a string that will help you to understand what is this job.

The `data` can be anything, let's say, the parameters for this job.

## onJob(job: IQJob, done: () => void): void

The `onJob` is a method that you should override is order you to process the jobs.

If you don't override you will get an exception on `addJob()`.

*Note:* you have to call the `done()` when you finish otherwise the execution will stuck. It's up to you to take care of it!  

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
}
```
