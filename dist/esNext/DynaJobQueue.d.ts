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
    /**
     * Creates a function whose calls are added to the queue.
     */
    jobFactory<TResolve>(func: (...params: any[]) => Promise<TResolve>, priority?: number): () => Promise<TResolve>;
    /**
     * Adds a job that returns a Promise.
     */
    addJobPromised<TResolve>(
    /**
     * Function that executes a Promise as a job.
     */
    returnPromise: () => Promise<TResolve>, 
    /**
     * Job priority. The higher the number, the higher the priority.
     */
    priority?: number): Promise<TResolve>;
    /**
     * Adds a job that returns a Promise but does not return any data.
     * Any errors will be logged with console.error.
     *
     * Useful for fire-and-forget jobs where no result is needed.
     */
    addJobPromisedVoid(
    /**
     * Function that executes a Promise as a job.
     */
    returnPromise: () => Promise<any>, 
    /**
     * Job priority. The higher the number, the higher the priority.
     */
    priority?: number): void;
    /**
     * Adds a job that returns a Promise, based on resolve and reject callbacks.
     */
    addJobPromise<TResolve>(
    /**
     * Function that executes a Promise as a job.
     * You must call resolve or reject inside the callback to finish the job.
     */
    callback: (resolve: (data?: TResolve) => void, reject: (error?: any) => void) => void, priority?: number): Promise<TResolve>;
    /**
     * Adds a job by callback.
     * You must call `done()` to finish the job.
     * @param callback
     * @param priority
     */
    addJobCallback(callback: (done: Function) => void, priority?: number): void;
    /**
     * Returns the current Job Queue statistics.
     */
    readonly stats: IDynaJobQueueStats;
    /**
     * Checks if the queue is active, meaning there are jobs pending or running in parallel.
     */
    readonly isWorking: boolean;
    /**
     * Waits until all jobs are completed.
     */
    allDone(): Promise<void>;
    private addJob;
    private _execute;
    private _internalCounter;
    private _createPriorityNumber;
}
