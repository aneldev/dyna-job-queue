export interface IDynaJobQueueConfig {
  parallels?: number;
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

  constructor(private _config: IDynaJobQueueConfig = {}) {
    this._config = {
      parallels: 1,
      ...this._config
    };
  }

  public addJobPromise<TResolve>(callback: (resolve: (data?: TResolve) => void, reject: (error?: any) => void) => void, priority: number = 1): Promise<TResolve> {
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

  public addJobPromised<TResolve>(returnPromise: () => Promise<TResolve>, priority: number = 1): Promise<TResolve> {
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

  public addJobCallback(callback: (done: Function) => void, priority: number = 1): void {
    this.addJob(priority, callback);
  }

  public jobFactory<TResolve>(func: (...params: any[]) => Promise<TResolve>, priority: number = 1): () => Promise<TResolve> {
    return (...params: any[]) =>
      this.addJobPromised(() => func(...params), priority);
  }

  public get stats(): IDynaJobQueueStats {
    return {
      jobs: this._jobs.length,
      running: this._parallels,
    };
  }

  public get isWorking(): boolean {
    return !!this._jobs.length || !!this._parallels;
  }

  private addJob(priority: number = 1, callback: (done: Function) => void): void {
    let job: IQJob = {priority, internalPriority: this._createPriorityNumber(priority), callback};
    this._jobs.push(job);
    this._jobs.sort((jobA: IQJob, jobB: IQJob) => jobA.internalPriority - jobB.internalPriority);
    setTimeout(() => this._execute(), 0);
  }

  private _execute(): void {
    if (this._parallels === this._config.parallels) return;
    const jobToExecute: IQJob | undefined= this._jobs.shift();
    if (this._jobs.length === 0) this._internalCounter = 0;

    if (jobToExecute) {
      this._parallels++;
      jobToExecute.callback(() => {
        this._parallels--;
        this._execute();
      });
    }
  }

  private _internalCounter: number = 0;

  private _createPriorityNumber(priority: number): number {
    return Number(("000000000000000" + priority).substr(-15) + '0' + ("0000000000" + (++this._internalCounter)).substr(-10));
  }

}
