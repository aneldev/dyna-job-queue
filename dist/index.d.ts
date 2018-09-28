export interface IDynaJobQueueConfig {
    parallels?: number;
}
export interface IDynaJobQueueStats {
    jobs: number;
    running: number;
}
export declare class DynaJobQueue {
    private _config;
    private _jobs;
    private _parallels;
    constructor(_config?: IDynaJobQueueConfig);
    addJobCallback(callback: (done: Function) => void, priority?: number): void;
    addJobPromise<TData>(callback: (resolve: (data?: TData) => void, reject: (error?: any) => void) => void, priority?: number): Promise<TData>;
    readonly stats: IDynaJobQueueStats;
    readonly isWorking: boolean;
    private addJob;
    private _execute;
    private _internalCounter;
    private _createPriorityNumber;
}
