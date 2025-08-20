export interface IDynaJobQueueConfig {
    parallels?: number;
}
export interface IDynaJobQueueStats {
    isWorking: boolean;
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
     * @typeParam TResolve - The resolved value type of the Promise.
     * @param func - Function that returns a Promise when invoked.
     * @param priority - Job priority; lower numbers run first. Defaults to 1.
     * @returns A function that enqueues calls to `func` and returns its Promise.
     */
    jobFactory<TResolve>(func: (...params: any[]) => Promise<TResolve>, priority?: number): (...params: any[]) => Promise<TResolve>;
    /**
     * Adds a job that returns a Promise.
     * @typeParam TResolve - The resolved value type of the Promise.
     * @param returnPromise - Function that executes a Promise as a job.
     * @param priority - Job priority; lower numbers run first. Defaults to 1.
     * @returns A Promise that resolves/rejects with the job’s result.
     */
    addJobPromised<TResolve>(returnPromise: () => Promise<TResolve>, priority?: number): Promise<TResolve>;
    /**
     * Adds a job that returns a Promise but ignores the result.
     * Any errors are logged with `console.error`.
     *
     * Useful for fire-and-forget jobs where no result is needed.
     * @param returnPromise - Function that executes a Promise as a job.
     * @param priority - Job priority; lower numbers run first. Defaults to 1.
     */
    addJobPromisedVoid(returnPromise: () => Promise<any>, priority?: number): void;
    /**
     * Adds a job that returns a Promise, based on resolve/reject callbacks.
     * You must call `resolve` or `reject` inside the callback to finish the job.
     * @typeParam TResolve - The resolved value type of the Promise.
     * @param callback - Invoked with `(resolve, reject)` to produce the Promise outcome.
     * @param priority - Job priority; lower numbers run first. Defaults to 1.
     * @returns A Promise that resolves/rejects as signaled by the callback.
     */
    addJobPromise<TResolve>(callback: (resolve: (data?: TResolve) => void, reject: (error?: any) => void) => void, priority?: number): Promise<TResolve>;
    /**
     * Adds a job by callback. You must call `done()` to finish the job.
     * @param callback - Function that performs the work; call `done()` when finished.
     * @param priority - Job priority; lower numbers run first. Defaults to 1.
     */
    addJobCallback(callback: (done: Function) => void, priority?: number): void;
    /**
     * Returns the current job-queue statistics.
     */
    readonly stats: IDynaJobQueueStats;
    /**
     * Indicates whether the queue is active (pending jobs or running workers).
     */
    readonly isWorking: boolean;
    /**
     * Resolves when all queued jobs have completed and none are running.
     * @returns A Promise that resolves once the queue is idle.
     */
    allDone(): Promise<void>;
    private addJob;
    private _execute;
    private _internalCounter;
    private _createPriorityNumber;
}
