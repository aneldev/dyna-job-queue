export interface IDynaJobQueueConfig {
  parallels?: number;   // Default is 1
}

export interface IDynaJobQueueStats {
  isWorking: boolean;
  jobs: number;
  running: number;
}

interface IQJob {
  priority: number;
  callback: (done: () => void) => void;
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
   * @typeParam TResolve - The resolved value type of the Promise.
   * @param func - Function that returns a Promise when invoked.
   * @param priority - Job priority; lower numbers run first. Defaults to 1.
   * @returns A function that enqueues calls to `func` and returns its Promise.
   */
  public jobFactory<TResolve>(
    func: (...params: any[]) => Promise<TResolve>,
    priority: number = 1
  ): (...params: any[]) => Promise<TResolve> {
    return (...params: any[]) => {
      return this.addJobPromised(() => func(...params), priority);
    }
  }

  /**
   * Adds a job that returns a Promise.
   * @typeParam TResolve - The resolved value type of the Promise.
   * @param returnPromise - Function that executes a Promise as a job.
   * @param priority - Job priority; lower numbers run first. Defaults to 1.
   * @returns A Promise that resolves/rejects with the job’s result.
   */
  public addJobPromised<TResolve>(
    returnPromise: () => Promise<TResolve>,
    priority: number = 1,
  ): Promise<TResolve> {
    return new Promise((resolve, reject) => {
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
   * Adds a job that returns a Promise but ignores the result.
   * Any errors are logged with `console.error`.
   *
   * Useful for fire-and-forget jobs where no result is needed.
   * @param returnPromise - Function that executes a Promise as a job.
   * @param priority - Job priority; lower numbers run first. Defaults to 1.
   */
  public addJobPromisedVoid(
    returnPromise: () => Promise<any>,
    priority: number = 1,
  ): void {
    this.addJobCallback(
      (done: () => void) => {
        returnPromise()
          .then(() => done())
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
   * Adds a job that returns a Promise, based on resolve/reject callbacks.
   * You must call `resolve` or `reject` inside the callback to finish the job.
   * @typeParam TResolve - The resolved value type of the Promise.
   * @param callback - Invoked with `(resolve, reject)` to produce the Promise outcome.
   * @param priority - Job priority; lower numbers run first. Defaults to 1.
   * @returns A Promise that resolves/rejects as signaled by the callback.
   */
  public addJobPromise<TResolve>(
    callback: (resolve: (data?: TResolve) => void, reject: (error?: any) => void) => void,
    priority: number = 1,
  ): Promise<TResolve> {
    return new Promise((resolve, reject) => {
      this.addJobCallback(
        (done: () => void) => callback(
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
   * Adds a job by callback. You must call `done()` to finish the job.
   * @param callback - Function that performs the work; call `done()` when finished.
   * @param priority - Job priority; lower numbers run first. Defaults to 1.
   */
  public addJobCallback(
    callback: (done: () => void) => void,
    priority: number = 1,
  ): void {
    this.addJob(callback, priority);
  }

  /**
   * Returns the current job-queue statistics.
   */
  public get stats(): IDynaJobQueueStats {
    return {
      isWorking: this.isWorking,
      jobs: this._jobs.length,
      running: this._parallels,
    };
  }

  /**
   * Indicates whether the queue is active (pending jobs or running workers).
   */
  public get isWorking(): boolean {
    return !!this._jobs.length || !!this._parallels;
  }

  /**
   * Resolves when all queued jobs have completed and none are running.
   * @returns A Promise that resolves once the queue is idle.
   */
  public async allDone(): Promise<void> {
    if (!this.isWorking) return;
    return new Promise(resolve => this._completeCallbacks.push(resolve));
  }

  private addJob(callback: (done: () => void) => void, priority: number = 1): void {
    const job: IQJob = {
      priority,
      internalPriority: this._createPriorityNumber(priority),
      callback,
    };
    this._jobs.push(job);
    this._jobs.sort((jobA, jobB) => jobA.internalPriority - jobB.internalPriority);
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

        if (this.isWorking) {
          this._execute()
        }
        else {
          while (this._completeCallbacks.length) this._completeCallbacks.shift()();
        }
      });
    }
  }

  private _internalCounter: number = 0;

  private _createPriorityNumber(priority: number): number {
    return Number(("000000000000000" + priority).substr(-15) + '0' + ("0000000000" + (++this._internalCounter)).substr(-10));
  }

}

console.debug('DynaJobQueue loaded v33');
