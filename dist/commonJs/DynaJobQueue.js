"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var DynaJobQueue = /** @class */ (function () {
    function DynaJobQueue(_config) {
        if (_config === void 0) { _config = {}; }
        this._config = _config;
        this._jobs = [];
        this._parallels = 0;
        this._completeCallbacks = [];
        this._internalCounter = 0;
        this._config = __assign({ parallels: 1 }, this._config);
    }
    /**
     * Creates a function whose calls are added to the queue.
     * @typeParam TResolve - The resolved value type of the Promise.
     * @param func - Function that returns a Promise when invoked.
     * @param priority - Job priority; lower numbers run first. Defaults to 1.
     * @returns A function that enqueues calls to `func` and returns its Promise.
     */
    DynaJobQueue.prototype.jobFactory = function (func, priority) {
        var _this = this;
        if (priority === void 0) { priority = 1; }
        return function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            return _this.addJobPromised(function () { return func.apply(void 0, params); }, priority);
        };
    };
    /**
     * Adds a job that returns a Promise.
     * @typeParam TResolve - The resolved value type of the Promise.
     * @param returnPromise - Function that executes a Promise as a job.
     * @param priority - Job priority; lower numbers run first. Defaults to 1.
     * @returns A Promise that resolves/rejects with the job’s result.
     */
    DynaJobQueue.prototype.addJobPromised = function (returnPromise, priority) {
        var _this = this;
        if (priority === void 0) { priority = 1; }
        return new Promise(function (resolve, reject) {
            _this.addJobCallback(function (done) {
                returnPromise()
                    .then(function (resolveData) {
                    resolve(resolveData);
                    done();
                })
                    .catch(function (error) {
                    reject(error);
                    done();
                });
            }, priority);
        });
    };
    /**
     * Adds a job that returns a Promise but ignores the result.
     * Any errors are logged with `console.error`.
     *
     * Useful for fire-and-forget jobs where no result is needed.
     * @param returnPromise - Function that executes a Promise as a job.
     * @param priority - Job priority; lower numbers run first. Defaults to 1.
     */
    DynaJobQueue.prototype.addJobPromisedVoid = function (returnPromise, priority) {
        if (priority === void 0) { priority = 1; }
        this.addJobCallback(function (done) {
            returnPromise()
                .then(function () { return done(); })
                .catch(function (error) {
                console.error('DynaJobQueue.addJobPromisedVoid - Job failed', {
                    error: error,
                    returnPromise: returnPromise,
                });
                done();
            });
        }, priority);
    };
    /**
     * Adds a job that returns a Promise, based on resolve/reject callbacks.
     * You must call `resolve` or `reject` inside the callback to finish the job.
     * @typeParam TResolve - The resolved value type of the Promise.
     * @param callback - Invoked with `(resolve, reject)` to produce the Promise outcome.
     * @param priority - Job priority; lower numbers run first. Defaults to 1.
     * @returns A Promise that resolves/rejects as signaled by the callback.
     */
    DynaJobQueue.prototype.addJobPromise = function (callback, priority) {
        var _this = this;
        if (priority === void 0) { priority = 1; }
        return new Promise(function (resolve, reject) {
            _this.addJobCallback(function (done) { return callback(function (data) {
                resolve(data);
                done();
            }, function (error) {
                reject(error);
                done();
            }); }, priority);
        });
    };
    /**
     * Adds a job by callback. You must call `done()` to finish the job.
     * @param callback - Function that performs the work; call `done()` when finished.
     * @param priority - Job priority; lower numbers run first. Defaults to 1.
     */
    DynaJobQueue.prototype.addJobCallback = function (callback, priority) {
        if (priority === void 0) { priority = 1; }
        this.addJob(callback, priority);
    };
    Object.defineProperty(DynaJobQueue.prototype, "stats", {
        /**
         * Returns the current job-queue statistics.
         */
        get: function () {
            return {
                isWorking: this.isWorking,
                jobs: this._jobs.length,
                running: this._parallels,
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynaJobQueue.prototype, "isWorking", {
        /**
         * Indicates whether the queue is active (pending jobs or running workers).
         */
        get: function () {
            return !!this._jobs.length || !!this._parallels;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Resolves when all queued jobs have completed and none are running.
     * @returns A Promise that resolves once the queue is idle.
     */
    DynaJobQueue.prototype.allDone = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.isWorking)
                    return [2 /*return*/];
                return [2 /*return*/, new Promise(function (resolve) { return _this._completeCallbacks.push(resolve); })];
            });
        });
    };
    DynaJobQueue.prototype.addJob = function (callback, priority) {
        if (priority === void 0) { priority = 1; }
        var job = {
            priority: priority,
            internalPriority: this._createPriorityNumber(priority),
            callback: callback,
        };
        this._jobs.push(job);
        this._jobs.sort(function (jobA, jobB) { return jobA.internalPriority - jobB.internalPriority; });
        this._execute();
    };
    DynaJobQueue.prototype._execute = function () {
        var _this = this;
        if (this._parallels === this._config.parallels)
            return;
        var jobToExecute = this._jobs.shift();
        if (this._jobs.length === 0)
            this._internalCounter = 0;
        if (jobToExecute) {
            this._parallels++;
            jobToExecute.callback(function () {
                _this._parallels--;
                if (_this.isWorking) {
                    _this._execute();
                }
                else {
                    while (_this._completeCallbacks.length)
                        _this._completeCallbacks.shift()();
                }
            });
        }
    };
    DynaJobQueue.prototype._createPriorityNumber = function (priority) {
        return Number(("000000000000000" + priority).substr(-15) + '0' + ("0000000000" + (++this._internalCounter)).substr(-10));
    };
    return DynaJobQueue;
}());
exports.DynaJobQueue = DynaJobQueue;
//# sourceMappingURL=DynaJobQueue.js.map