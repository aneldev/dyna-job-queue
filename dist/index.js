(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("dyna-job-queue", [], factory);
	else if(typeof exports === 'object')
		exports["dyna-job-queue"] = factory();
	else
		root["dyna-job-queue"] = factory();
})(global, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/DynaJobQueue.ts"
/*!*****************************!*\
  !*** ./src/DynaJobQueue.ts ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DynaJobQueue: () => (/* binding */ DynaJobQueue)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var DynaJobQueue = /*#__PURE__*/function () {
  function DynaJobQueue() {
    var _config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, DynaJobQueue);
    this._config = _config;
    this._jobs = [];
    this._parallels = 0;
    this._completeCallbacks = [];
    this._internalCounter = 0;
    this._config = Object.assign({
      parallels: 1
    }, this._config);
  }
  /**
   * Creates a function whose calls are added to the queue.
   * @typeParam TResolve - The resolved value type of the Promise.
   * @param func - Function that returns a Promise when invoked.
   * @param priority - Job priority; lower numbers run first. Defaults to 1.
   * @returns A function that enqueues calls to `func` and returns its Promise.
   */
  return _createClass(DynaJobQueue, [{
    key: "jobFactory",
    value: function jobFactory(func) {
      var _this = this;
      var priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      return function () {
        for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
          params[_key] = arguments[_key];
        }
        return _this.addJobPromised(function () {
          return func.apply(void 0, params);
        }, priority);
      };
    }
    /**
     * Adds a job that returns a Promise.
     * @typeParam TResolve - The resolved value type of the Promise.
     * @param returnPromise - Function that executes a Promise as a job.
     * @param priority - Job priority; lower numbers run first. Defaults to 1.
     * @returns A Promise that resolves/rejects with the job’s result.
     */
  }, {
    key: "addJobPromised",
    value: function addJobPromised(returnPromise) {
      var _this2 = this;
      var priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      return new Promise(function (resolve, reject) {
        _this2.addJobCallback(function (done) {
          returnPromise().then(function (resolveData) {
            resolve(resolveData);
            done();
          })["catch"](function (error) {
            reject(error);
            done();
          });
        }, priority);
      });
    }
    /**
     * Adds a job that returns a Promise but ignores the result.
     * Any errors are logged with `console.error`.
     *
     * Useful for fire-and-forget jobs where no result is needed.
     * @param returnPromise - Function that executes a Promise as a job.
     * @param priority - Job priority; lower numbers run first. Defaults to 1.
     */
  }, {
    key: "addJobPromisedVoid",
    value: function addJobPromisedVoid(returnPromise) {
      var priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      this.addJobCallback(function (done) {
        returnPromise().then(function () {
          return done();
        })["catch"](function (error) {
          console.error('DynaJobQueue.addJobPromisedVoid - Job failed', {
            error: error,
            returnPromise: returnPromise
          });
          done();
        });
      }, priority);
    }
    /**
     * Adds a job that returns a Promise, based on resolve/reject callbacks.
     * You must call `resolve` or `reject` inside the callback to finish the job.
     * @typeParam TResolve - The resolved value type of the Promise.
     * @param callback - Invoked with `(resolve, reject)` to produce the Promise outcome.
     * @param priority - Job priority; lower numbers run first. Defaults to 1.
     * @returns A Promise that resolves/rejects as signaled by the callback.
     */
  }, {
    key: "addJobPromise",
    value: function addJobPromise(callback) {
      var _this3 = this;
      var priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      return new Promise(function (resolve, reject) {
        _this3.addJobCallback(function (done) {
          return callback(function (data) {
            resolve(data);
            done();
          }, function (error) {
            reject(error);
            done();
          });
        }, priority);
      });
    }
    /**
     * Adds a job by callback. You must call `done()` to finish the job.
     * @param callback - Function that performs the work; call `done()` when finished.
     * @param priority - Job priority; lower numbers run first. Defaults to 1.
     */
  }, {
    key: "addJobCallback",
    value: function addJobCallback(callback) {
      var priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      this.addJob(callback, priority);
    }
    /**
     * Returns the current job-queue statistics.
     */
  }, {
    key: "stats",
    get: function get() {
      return {
        isWorking: this.isWorking,
        jobs: this._jobs.length,
        running: this._parallels
      };
    }
    /**
     * Indicates whether the queue is active (pending jobs or running workers).
     */
  }, {
    key: "isWorking",
    get: function get() {
      return !!this._jobs.length || !!this._parallels;
    }
    /**
     * Resolves when all queued jobs have completed and none are running.
     * @returns A Promise that resolves once the queue is idle.
     */
  }, {
    key: "allDone",
    value: function allDone() {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/_regenerator().m(function _callee() {
        var _this4 = this;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              if (this.isWorking) {
                _context.n = 1;
                break;
              }
              return _context.a(2);
            case 1:
              return _context.a(2, new Promise(function (resolve) {
                return _this4._completeCallbacks.push(resolve);
              }));
          }
        }, _callee, this);
      }));
    }
  }, {
    key: "addJob",
    value: function addJob(callback) {
      var priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var job = {
        priority: priority,
        internalPriority: this._createPriorityNumber(priority),
        callback: callback
      };
      this._jobs.push(job);
      this._jobs.sort(function (jobA, jobB) {
        return jobA.internalPriority - jobB.internalPriority;
      });
      this._execute();
    }
  }, {
    key: "_execute",
    value: function _execute() {
      var _this5 = this;
      if (this._parallels === this._config.parallels) return;
      var jobToExecute = this._jobs.shift();
      if (this._jobs.length === 0) this._internalCounter = 0;
      if (jobToExecute) {
        this._parallels++;
        jobToExecute.callback(function () {
          _this5._parallels--;
          if (_this5.isWorking) {
            _this5._execute();
          } else {
            while (_this5._completeCallbacks.length) _this5._completeCallbacks.shift()();
          }
        });
      }
    }
  }, {
    key: "_createPriorityNumber",
    value: function _createPriorityNumber(priority) {
      return Number(("000000000000000" + priority).substr(-15) + '0' + ("0000000000" + ++this._internalCounter).substr(-10));
    }
  }]);
}();

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter/value functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			if(Array.isArray(definition)) {
/******/ 				var i = 0;
/******/ 				while(i < definition.length) {
/******/ 					var key = definition[i++];
/******/ 					var binding = definition[i++];
/******/ 					if(!__webpack_require__.o(exports, key)) {
/******/ 						if(binding === 0) {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, value: definition[i++] });
/******/ 						} else {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, get: binding });
/******/ 						}
/******/ 					} else if(binding === 0) { i++; }
/******/ 				}
/******/ 			} else {
/******/ 				for(var key in definition) {
/******/ 					if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 						Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DynaJobQueue: () => (/* reexport safe */ _DynaJobQueue__WEBPACK_IMPORTED_MODULE_0__.DynaJobQueue)
/* harmony export */ });
/* harmony import */ var _DynaJobQueue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DynaJobQueue */ "./src/DynaJobQueue.ts");

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map