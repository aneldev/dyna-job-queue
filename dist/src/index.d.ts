export interface IDynaJobQueueConfig {
    parallels?: number;
}
export interface IQJob {
    command: string;
    data: any;
    priority: number;
    callback: Function;
    _internalPriority: number;
}
export interface IDynaJobQueueStats {
    jobs: number;
    running: number;
}
export declare class DynaJobQueue {
    private _config;
    private _jobs;
    private _isExecuting;
    private _parallels;
    constructor(_config?: IDynaJobQueueConfig);
    addJobCallback(callback: (done: Function) => void, priority?: number): IQJob;
    addJobPromise<TData>(callback: (resolve: (data?: TData) => void, reject: (error?: any) => void) => void, priority?: number): Promise<TData>;
    readonly stats: IDynaJobQueueStats;
    readonly isWorking: boolean;
    private addJob;
    private _execute;
    private _internalCounter;
    private _createPriorityNumber;
}
