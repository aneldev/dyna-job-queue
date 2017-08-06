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

Object.defineProperty(exports, "__esModule", { value: true });
class DynaJobQueue {
    constructor() {
        this._jobs = [];
        this._isExecuting = false;
        this._internalCounter = 0;
    }
    addJob(command, data, priority = 1, _callback) {
        if (!_callback)
            _callback = this.onJob;
        let job = { command, data, priority, _internalPriority: this._createPriorityNumber(priority), _callback: _callback };
        this._jobs.push(job);
        this._jobs.sort((jobA, jobB) => jobA._internalPriority - jobB._internalPriority);
        setTimeout(() => this._execute(), 0);
        return job;
    }
    addJobCallback(callback, priority = 1) {
        return this.addJob(null, null, priority, callback);
    }
    onJob(job, done) {
        // to override!
        throw Error('DynaJobQueue: onJob! error, you should override the onJob function where is called when a job is available');
    }
    get count() {
        return this._jobs.length;
    }
    _execute() {
        if (this._isExecuting)
            return;
        const jobToExecute = this._jobs.shift();
        if (this._jobs.length === 0)
            this._internalCounter = 0;
        if (jobToExecute) {
            // the regular onJob
            if (jobToExecute._callback === this.onJob) {
                this._isExecuting = true;
                jobToExecute._callback(jobToExecute, () => {
                    this._isExecuting = false;
                    this._execute();
                });
            }
            else {
                this._isExecuting = true;
                jobToExecute._callback(() => {
                    this._isExecuting = false;
                    this._execute();
                });
            }
        }
    }
    _createPriorityNumber(priority) {
        return Number(("000000000000000" + priority).substr(-15) + '0' + ("0000000000" + (++this._internalCounter)).substr(-10));
    }
}
exports.DynaJobQueue = DynaJobQueue;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});