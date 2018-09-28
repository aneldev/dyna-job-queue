(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("dyna-job-queue", [], factory);
	else if(typeof exports === 'object')
		exports["dyna-job-queue"] = factory();
	else
		root["dyna-job-queue"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var DynaJobQueue = /** @class */ (function () {
    function DynaJobQueue(_config) {
        if (_config === void 0) { _config = {}; }
        this._config = _config;
        this._jobs = [];
        this._parallels = 0;
        this._internalCounter = 0;
        this._config = __assign({ parallels: 1 }, this._config);
    }
    DynaJobQueue.prototype.addJobCallback = function (callback, priority) {
        if (priority === void 0) { priority = 1; }
        this.addJob(null, null, priority, callback);
    };
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
    DynaJobQueue.prototype.addJob = function (command, data, priority, callback) {
        var _this = this;
        if (priority === void 0) { priority = 1; }
        var job = { command: command, data: data, priority: priority, internalPriority: this._createPriorityNumber(priority), callback: callback };
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
exports.DynaJobQueue = DynaJobQueue;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});