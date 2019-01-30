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
var DynaJobQueue = /** @class */ (function () {
    function DynaJobQueue(_config) {
        if (_config === void 0) { _config = {}; }
        this._config = _config;
        this._jobs = [];
        this._parallels = 0;
        this._internalCounter = 0;
        this._config = __assign({ parallels: 1 }, this._config);
    }
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
    DynaJobQueue.prototype.addJobCallback = function (callback, priority) {
        if (priority === void 0) { priority = 1; }
        this.addJob(priority, callback);
    };
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
    Object.defineProperty(DynaJobQueue.prototype, "stats", {
        get: function () {
            return {
                jobs: this._jobs.length,
                running: this._parallels,
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynaJobQueue.prototype, "isWorking", {
        get: function () {
            return !!this._jobs.length || !!this._parallels;
        },
        enumerable: true,
        configurable: true
    });
    DynaJobQueue.prototype.addJob = function (priority, callback) {
        var _this = this;
        if (priority === void 0) { priority = 1; }
        var job = { priority: priority, internalPriority: this._createPriorityNumber(priority), callback: callback };
        this._jobs.push(job);
        this._jobs.sort(function (jobA, jobB) { return jobA.internalPriority - jobB.internalPriority; });
        setTimeout(function () { return _this._execute(); }, 0);
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
                _this._execute();
            });
        }
    };
    DynaJobQueue.prototype._createPriorityNumber = function (priority) {
        return Number(("000000000000000" + priority).substr(-15) + '0' + ("0000000000" + (++this._internalCounter)).substr(-10));
    };
    return DynaJobQueue;
}());
export { DynaJobQueue };
//# sourceMappingURL=DynaJobQueue.js.map