export interface IQJob {
    command: string;
    data: any;
    priority: number;
    _callback: Function;
    _internalPriority: number;
}
export declare class DynaJobQueue {
    private _jobs;
    private _isExecuting;
    addJob(command: string, data: any, priority?: number, _callback?: Function | ((job: IQJob, done: Function) => void)): IQJob;
    addJobCallback(callback: (done: Function) => void, priority?: number): IQJob;
    addJobPromise(callback: (resolve: (data: any) => void, reject: (error: any) => void) => void, priority?: number): Promise<any>;
    onJob(job: IQJob, done: () => void): void;
    readonly count: number;
    readonly isWorking: boolean;
    private _execute();
    private _internalCounter;
    private _createPriorityNumber(priority);
}
