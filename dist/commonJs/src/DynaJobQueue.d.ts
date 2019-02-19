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
    addJobPromise<TResolve>(callback: (resolve: (data?: TResolve) => void, reject: (error?: any) => void) => void, priority?: number): Promise<TResolve>;
    addJobPromised<TResolve>(returnPromise: () => Promise<TResolve>, priority?: number): Promise<TResolve>;
    addJobCallback(callback: (done: Function) => void, priority?: number): void;
    jobFactory<TResolve>(func: (...params: any[]) => Promise<TResolve>, priority?: number): () => Promise<TResolve>;
    readonly stats: IDynaJobQueueStats;
    readonly isWorking: boolean;
    private addJob;
    private _execute;
    private _internalCounter;
    private _createPriorityNumber;
}
