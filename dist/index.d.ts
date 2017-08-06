export interface IQJob {
    command: string;
    data: any;
}
export declare class DynaJobQueue {
    private _jobs;
    private _isExecuting;
    addJob(command: string, data: any): IQJob;
    onJob(job: IQJob, done: () => void): void;
    readonly count: number;
    private _execute();
}
