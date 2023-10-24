export interface IDynaJobQueueConfig {
    parallels?: number;
}
export interface IDynaJobQueueStats {
    jobs: number;
    running: number;
}
export declare class DynaJobQueue {
    private readonly _config;
    private _jobs;
    private _parallels;
    private readonly _completeCallbacks;
    constructor(_config?: IDynaJobQueueConfig);
    jobFactory<TResolve>(func: (...params: any[]) => Promise<TResolve>, priority?: number): () => Promise<TResolve>;
    addJobPromised<TResolve>(returnPromise: () => Promise<TResolve>, priority?: number): Promise<TResolve>;
    addJobPromise<TResolve>(callback: (resolve: (data?: TResolve) => void, reject: (error?: any) => void) => void, priority?: number): Promise<TResolve>;
    addJobCallback(callback: (done: () => void) => void, priority?: number): void;
    get stats(): IDynaJobQueueStats;
    get isWorking(): boolean;
    allDone(): Promise<void>;
    private addJob;
    private _execute;
    private _internalCounter;
    private _createPriorityNumber;
}
