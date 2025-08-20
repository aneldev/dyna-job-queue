export interface IDynaJobQueueConfig {
  parallels?: number;   // Default is 1
}

export interface IDynaJobQueueStats {
  jobs: number;
  running: number;
}

interface IQJob {
  priority: number;
  callback: Function;
  internalPriority: number,
}

export class DynaJobQueue {
  private _jobs: IQJob[] = [];
  private _parallels: number = 0;
  private readonly _completeCallbacks: any[] = [];

  constructor(private readonly _config: IDynaJobQueueConfig = {}) {
    this._config = {
      parallels: 1,
      ...this._config
    };
  }

  /**
   * Creates a function whose calls are added to the queue.
   */
  public jobFactory<TResolve>(func: (...params: any[]) => Promise<TResolve>, priority: number = 1): () => Promise<TResolve> {
    return (...params: any[]) => {
      return this.addJobPromised(() => func(...params), priority);
    }
  }

  /**
   * Adds a job that returns a Promise.
   */
  public addJobPromised<TResolve>(
    /**
     * Function that executes a Promise as a job.
     */
    returnPromise: () => Promise<TResolve>,
    /**
     * Job priority. The higher the number, the higher the priority.
     */
    priority: number = 1,
  ): Promise<TResolve> {
    return new Promise((resolve: (resolveData: TResolve) => void, reject: (error: any) => void) => {
      this.addJobCallback(
        (done: () => void) => {
          returnPromise()
            .then((resolveData: TResolve) => {
              resolve(resolveData);
              done();
            })
            .catch((error: any) => {
              reject(error);
              done();
            });
        },
        priority);
    });
  }

  /**
   * Adds a job that returns a Promise but does not return any data.
   * Any errors will be logged with console.error.
   *
   * Useful for fire-and-forget jobs where no result is needed.
   */
  public addJobPromisedVoid(
    /**
     * Function that executes a Promise as a job.
     */
    returnPromise: () => Promise<any>,
    /**
     * Job priority. The higher the number, the higher the priority.
     */
    priority: number = 1,
  ) {
    this.addJobCallback(
      (done: () => void) => {
        returnPromise()
          .then(done)
          .catch((error: any) => {
            console.error('DynaJobQueue.addJobPromisedVoid - Job failed', {
              error,
              returnPromise,
            });
            done();
          });
      },
      priority);
  }

  /**
   * Adds a job that returns a Promise, based on resolve and reject callbacks.
   */
  public addJobPromise<TResolve>(
    /**
     * Function that executes a Promise as a job.
     * You must call resolve or reject inside the callback to finish the job.
     */
    callback: (resolve: (data?: TResolve) => void, reject: (error?: any) => void) => void,
    priority: number = 1,
  ): Promise<TResolve> {
    return new Promise((resolve: (data: any) => void, reject: (error: any) => void) => {
      this.addJobCallback(
        (done: Function) => callback(
          (data: any) => {
            resolve(data);
            done();
          },
          (error: any) => {
            reject(error);
            done();
          }),
        priority);
    });
  }

  /**
   * Adds a job by callback.
   * You must call `done()` to finish the job.
   * @param callback
   * @param priority
   */
  public addJobCallback(callback: (done: Function) => void, priority: number = 1): void {
    this.addJob(callback, priority);
  }

  /**
   * Returns the current Job Queue statistics.
   */
  public get stats(): IDynaJobQueueStats {
    return {
      jobs: this._jobs.length,
      running: this._parallels,
    };
  }

  /**
   * Checks if the queue is active, meaning there are jobs pending or running in parallel.
   */
  public get isWorking(): boolean {
    return !!this._jobs.length || !!this._parallels;
  }

  /**
   * Waits until all jobs are completed.
   */
  public async allDone(): Promise<void> {
    if (!this.isWorking) return;
    return new Promise(resolve => this._completeCallbacks.push(resolve));
  }

  private addJob(callback: (done: Function) => void, priority: number = 1): void {
    let job: IQJob = {
      priority,
      internalPriority: this._createPriorityNumber(priority),
      callback,
    };
    this._jobs.push(job);
    this._jobs.sort((jobA: IQJob, jobB: IQJob) => jobA.internalPriority - jobB.internalPriority);
    this._execute();
  }

  private _execute(): void {
    if (this._parallels === this._config.parallels) return;
    const jobToExecute: IQJob | undefined = this._jobs.shift();
    if (this._jobs.length === 0) this._internalCounter = 0;

    if (jobToExecute) {
      this._parallels++;
      jobToExecute.callback(() => {
        this._parallels--;
        this._execute();
      });
    }
    else {
      while (this._completeCallbacks.length) this._completeCallbacks.shift()();
    }
  }

  private _internalCounter: number = 0;

  private _createPriorityNumber(priority: number): number {
    return Number(("000000000000000" + priority).substr(-15) + '0' + ("0000000000" + (++this._internalCounter)).substr(-10));
  }

}
