export interface IDynaJobQueueConfig {
  parallels?: number;
}

export interface IQJob {
  command: string;
  data: any;
  priority: number;
  callback: Function;
  _internalPriority: number,
}

export interface IDynaJobQueueStats {
  jobs: number;
  running: number;
}

export class DynaJobQueue {
  private _jobs: IQJob[] = [];
  private _isExecuting: boolean = false;
  private _parallels: number = 0;

  constructor(private _config: IDynaJobQueueConfig = {}) {
    this._config = {
      parallels: 1,
      ...this._config
    }
  }

  public addJobCallback(callback: (done: Function) => void, priority: number = 1): IQJob {
    return this.addJob(null, null, priority, callback);
  }

  public addJobPromise<TData>(callback: (resolve: (data?: TData) => void, reject: (error?: any) => void) => void, priority: number = 1): Promise<TData> {
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

  public get stats(): IDynaJobQueueStats {
    return {
      jobs: this._jobs.length,
      running: this._parallels,
    };
  }

  public get isWorking(): boolean {
    return !!this._jobs.length || this._isExecuting;
  }

  private addJob(command: string, data: any, priority: number = 1, callback: (done: Function) => void): IQJob {
    let job: IQJob = {command, data, priority, _internalPriority: this._createPriorityNumber(priority), callback};
    this._jobs.push(job);
    this._jobs.sort((jobA: IQJob, jobB: IQJob) => jobA._internalPriority - jobB._internalPriority);
    setTimeout(() => this._execute(), 0);
    return job;
  }

  private _execute(): void {
    if (this._isExecuting) return;
    if (this._parallels >= this._config.parallels) return;
    const jobToExecute: IQJob = this._jobs.shift();
    if (this._jobs.length === 0) this._internalCounter = 0;

    if (jobToExecute) {
      this._isExecuting = true;
      this._parallels++;
      jobToExecute.callback(() => {
        this._isExecuting = false;
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
