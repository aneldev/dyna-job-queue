export interface IQJob {
  command: string;
  data: any;
  priority: number;
  _callback: Function;
  _internalPriority: number,
}

export class DynaJobQueue {
  private _jobs: IQJob[] = [];
  private _isExecuting: boolean = false;

  public addJob(command: string, data: any, priority: number = 1, _callback?: Function | ((job: IQJob, done: Function) => void)): IQJob {
    if (!_callback) _callback = this.onJob;
    let job: IQJob = {command, data, priority, _internalPriority: this._createPriorityNumber(priority), _callback: _callback};
    this._jobs.push(job);
    this._jobs.sort((jobA: IQJob, jobB: IQJob) => jobA._internalPriority - jobB._internalPriority);
    setTimeout(() => this._execute(), 0);
    return job;
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

  public onJob(job: IQJob, done: () => void): void {
    // to override!
    throw Error('DynaJobQueue: onJob! error, you should override the onJob function where is called when a job is available');
  }

  public get count(): number {
    return this._jobs.length;
  }

  public get isWorking(): boolean {
    return !!this._jobs.length || this._isExecuting;
  }

  private _execute(): void {
    if (this._isExecuting) return;
    const jobToExecute: IQJob = this._jobs.shift();
    if (this._jobs.length === 0) this._internalCounter = 0;

    if (jobToExecute) {
      // the regular onJob
      if (jobToExecute._callback === this.onJob) {
        this._isExecuting = true;
        jobToExecute._callback(jobToExecute, () => {
          this._isExecuting = false;
          this._execute();
        });
      }
      // custom callback
      else{
        this._isExecuting = true;
        jobToExecute._callback(() => {
          this._isExecuting = false;
          this._execute();
        });
      }
    }
  }

  private _internalCounter: number = 0;

  private _createPriorityNumber(priority: number): number {
    return Number(("000000000000000" + priority).substr(-15) + '0' + ("0000000000" + (++this._internalCounter)).substr(-10));
  }

}
