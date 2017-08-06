export interface IQJob {
  command: string;
  data: any;
}

export class DynaJobQueue {
  private _jobs: IQJob[] = [];
  private _isExecuting: boolean = false;

  public addJob(command: string, data: any): IQJob {
    let job: IQJob = {command, data};
    this._jobs.push(job);
    setTimeout(() => this._execute(), 0);
    return job;
  }

  public onJob(job: IQJob, done: () => void): void {
    // to override!
    throw Error('DynaJobQueue: onJob! error, you should override the onJob function where is called when a job is available');
  }

  public get count(): number {
    return this._jobs.length;
  }

  private _execute(): void {
    if (this._isExecuting) return;
    const jobToExecute: IQJob = this._jobs.shift();

    if (jobToExecute) {
      this._isExecuting = true;
      this.onJob(jobToExecute, () => {
        this._isExecuting = false;
        this._execute();
      });
    }
  }
}
