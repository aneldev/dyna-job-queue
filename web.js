(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("dyna-job-queue", [], factory);
	else if(typeof exports === 'object')
		exports["dyna-job-queue"] = factory();
	else
		root["dyna-job-queue"] = factory();
})(window, function() {
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/web.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/DynaJobQueue.ts":
/*!*****************************!*\
  !*** ./src/DynaJobQueue.ts ***!
  \*****************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DynaJobQueue =
/** @class */
function () {
  function DynaJobQueue(_config) {
    if (_config === void 0) {
      _config = {};
    }

    this._config = _config;
    this._jobs = [];
    this._parallels = 0;
    this._internalCounter = 0;
    this._config = __assign({
      parallels: 1
    }, this._config);
  }

  DynaJobQueue.prototype.addJobPromise = function (callback, priority) {
    var _this = this;

    if (priority === void 0) {
      priority = 1;
    }

    return new Promise(function (resolve, reject) {
      _this.addJobCallback(function (done) {
        return callback(function (data) {
          resolve(data);
          done();
        }, function (error) {
          reject(error);
          done();
        });
      }, priority);
    });
  };

  DynaJobQueue.prototype.addJobPromised = function (returnPromise, priority) {
    var _this = this;

    if (priority === void 0) {
      priority = 1;
    }

    return new Promise(function (resolve, reject) {
      _this.addJobCallback(function (done) {
        returnPromise().then(function (resolveData) {
          resolve(resolveData);
          done();
        }).catch(function (error) {
          reject(error);
          done();
        });
      }, priority);
    });
  };

  DynaJobQueue.prototype.addJobCallback = function (callback, priority) {
    if (priority === void 0) {
      priority = 1;
    }

    this.addJob(priority, callback);
  };

  Object.defineProperty(DynaJobQueue.prototype, "stats", {
    get: function () {
      return {
        jobs: this._jobs.length,
        running: this._parallels
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

    if (priority === void 0) {
      priority = 1;
    }

    var job = {
      priority: priority,
      internalPriority: this._createPriorityNumber(priority),
      callback: callback
    };

    this._jobs.push(job);

    this._jobs.sort(function (jobA, jobB) {
      return jobA.internalPriority - jobB.internalPriority;
    });

    setTimeout(function () {
      return _this._execute();
    }, 0);
  };

  DynaJobQueue.prototype._execute = function () {
    var _this = this;

    if (this._parallels === this._config.parallels) return;

    var jobToExecute = this._jobs.shift();

    if (this._jobs.length === 0) this._internalCounter = 0;

    if (jobToExecute) {
      this._parallels++;
      jobToExecute.callback(function () {
        _this._parallels--;

        _this._execute();
      });
    }
  };

  DynaJobQueue.prototype._createPriorityNumber = function (priority) {
    return Number(("000000000000000" + priority).substr(-15) + '0' + ("0000000000" + ++this._internalCounter).substr(-10));
  };

  return DynaJobQueue;
}();

exports.DynaJobQueue = DynaJobQueue;

/***/ }),

/***/ "./src/web.ts":
/*!********************!*\
  !*** ./src/web.ts ***!
  \********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var DynaJobQueue_1 = __webpack_require__(/*! ./DynaJobQueue */ "./src/DynaJobQueue.ts");

exports.DynaJobQueue = DynaJobQueue_1.DynaJobQueue;

/***/ })

/******/ });
});
//# sourceMappingURL=web.js.map