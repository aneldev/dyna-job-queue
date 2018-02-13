/******/ (function(modules) { // webpackBootstrap
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(3);
//import './debug-typescript';  // debug typescript code
__webpack_require__(2); // debug any test (experimental)


/***/ }),
/* 1 */
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
    addJobPromise(callback, priority = 1) {
        return new Promise((resolve, reject) => {
            this.addJobCallback((done) => callback((data) => {
                resolve(data);
                done();
            }, (error) => {
                reject(error);
                done();
            }), priority);
        });
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
if (typeof jasmine !== 'undefined')
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
const src_1 = __webpack_require__(1);
// help: https://facebook.github.io/jest/docs/expect.html
describe('Dyna Job Queue - using addJob()', () => {
    let queue = new src_1.DynaJobQueue();
    let executedJobs = [];
    // this simulates a worker for this jobs, for the test we push these jobs to executedJobs array
    queue.onJob = (job, done) => {
        setTimeout(() => {
            executedJobs.push(job);
            done();
        }, 100);
    };
    const getLastExecutedJob = () => executedJobs[executedJobs.length - 1];
    it('should push one job', () => {
        let job = queue.addJob('loadConfig', { endPoint: 'http://example.com/awesomeCondig', _debugJonNo: 1 });
        expect(job.command).toBe('loadConfig');
        expect(job.data._debugJonNo).toBe(1);
        expect(queue.count).toBe(1);
    });
    it('should pick the job', (done) => {
        setTimeout(() => {
            let job = getLastExecutedJob();
            expect(job.command).toBe('loadConfig');
            expect(job.data._debugJonNo).toBe(1);
            expect(queue.count).toBe(0);
            done();
        }, 200);
    });
    const testForJobs = 100;
    it(`should push ${testForJobs} jobs`, () => {
        let ok = true;
        for (let i = 0; i < testForJobs; i++) {
            ok = ok && !!queue.addJob('loadData', { endPoint: 'http://example.com/awesomeData', _testId: `id-${i}` });
        }
        expect(ok).toBe(true);
    });
    it(`should pick last ${testForJobs} job in correct order`, (done) => {
        setTimeout(() => {
            let lastJobs = executedJobs.slice(-testForJobs);
            lastJobs.forEach((job, index) => {
                expect(job.command).toBe('loadData');
                expect(job.data._testId).toBe(`id-${index}`);
            });
            done();
        }, (testForJobs * 100) + 400);
    });
    it('pending jobs should 0', () => {
        expect(queue.count).toBe(0);
    });
    it('should ass job with priority', () => {
        let ok = true;
        ok = ok && !!queue.addJob('addTodo', { desc: 'Implement this', _debugId: 5 }, 8);
        ok = ok && !!queue.addJob('addTodo', { desc: 'Implement this', _debugId: 6 }, 8);
        ok = ok && !!queue.addJob('addTodo', { desc: 'Implement this', _debugId: 3 }, 2);
        ok = ok && !!queue.addJob('addTodo', { desc: 'Implement this', _debugId: 2 }, 1);
        ok = ok && !!queue.addJob('addTodo', { desc: 'Implement this', _debugId: 0 }, 0);
        ok = ok && !!queue.addJob('addTodo', { desc: 'Implement this', _debugId: 9 }, 11);
        ok = ok && !!queue.addJob('addTodo', { desc: 'Implement this', _debugId: 1 }, 0);
        ok = ok && !!queue.addJob('addTodo', { desc: 'Implement this', _debugId: 7 }, 10);
        ok = ok && !!queue.addJob('addTodo', { desc: 'Implement this', _debugId: 4 }, 3);
        ok = ok && !!queue.addJob('addTodo', { desc: 'Implement this', _debugId: 8 }, 10);
        expect(!!ok).toBe(true);
    });
    it('should pick the job in correct order', (done) => {
        setTimeout(() => {
            let lastJobs = executedJobs.slice(-10);
            lastJobs.forEach((job, index) => {
                expect(job.command).toBe('addTodo');
                expect(job.data._debugId).toBe(index);
            });
            done();
        }, 1300);
    });
});
describe('Dyna Job Queue - using addJobCallback()', () => {
    let queue = new src_1.DynaJobQueue();
    const testForCBJobs = 10;
    const testCollectedData = [];
    it('expects the pending jobs should 0', () => {
        expect(queue.count).toBe(0);
    });
    it(`should push ${testForCBJobs} jobs`, () => {
        let ok = true;
        for (let i = 0; i < testForCBJobs; i++) {
            ok = ok && !!queue.addJobCallback((done) => {
                setTimeout(() => {
                    testCollectedData.push({ index: i });
                    done();
                }, 100);
            });
        }
        expect(ok).toBe(true);
    });
    it(`expects the pending jobs to be ${testForCBJobs}`, () => {
        expect(queue.count).toBe(testForCBJobs);
    });
    it(`should pick last ${testForCBJobs} job in correct order`, (done) => {
        setTimeout(() => {
            testCollectedData.forEach((data, index) => {
                expect(data.index).toBe(index);
            });
            done();
        }, (testForCBJobs * 100) + 400);
    });
    it('expects the pending jobs should 0', () => {
        expect(queue.count).toBe(0);
    });
});
describe('Dyna Job Queue - using addJobPromise()', () => {
    let queue = new src_1.DynaJobQueue();
    const testForCBJobs = 10;
    const testCollectedData = [];
    it(`should push ${testForCBJobs} jobs`, (done) => {
        for (let i = 0; i < testForCBJobs; i++) {
            queue.addJobPromise((resolve, reject) => {
                setTimeout(() => {
                    let data = { index: i };
                    testCollectedData.push(data);
                    resolve(data);
                }, 100);
            }, 2)
                .then((data) => {
                let lastIndexValue = testCollectedData[testCollectedData.length - 1].index;
                expect(lastIndexValue).toBe(i);
                expect(data.index).toBe(i);
                if (lastIndexValue == 9)
                    done();
            });
        }
    });
    it('expects the pending jobs should 0', () => {
        expect(queue.count).toBe(0);
    });
});


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Dev node: Come on!!! this is super ugly...
// If you find a stable way to debug the jest tests please fork me!
// As documented here: https://facebook.github.io/jest/docs/troubleshooting.html is not working as far of May/17

if (typeof global === 'undefined' && typeof window !== 'undefined') global = window;

global._mockJest = null;

global.clearTest = function () {
  global._mockJest = {
    errors: 0,
    passed: 0,
    descriptions: []
  };
};
global.clearTest();

global.describe = function (description, cbDefineIts) {
  global._mockJest.descriptions.push({
    description: description,
    its: []
  });

  cbDefineIts();
  startTests();
};

global.describe.skip = function () {
  return undefined;
};

global.it = function (description, cbTest) {
  global._mockJest.descriptions[global._mockJest.descriptions.length - 1].its.push({
    description: description,
    cbTest: cbTest
  });
  startTests();
};

global.it.skip = function () {
  return undefined;
};

global.expect = function (expectValue) {
  return comparisons(expectValue);
};

var comparisons = function comparisons(expectValue) {
  var not = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  return {
    get not() {
      return comparisons(expectValue, true);
    },
    toBe: function toBe(toBeValue) {
      var result = expectValue === toBeValue;
      if (not) result = !result;
      if (result) {
        console.log('        Success, === equal value');
        global._mockJest.passed++;
      } else {
        console.log('        FAILED, expected [' + toBeValue + '] but received [' + expectValue + ']');
        global._mockJest.errors++;
      }
    }
  };
};

var startTimer = null;
function startTests() {
  if (startTimer) clearTimeout(startTimer);
  startTimer = setTimeout(executeTests, 100);
}

function executeTests() {
  var completedDecritpions = 0;
  console.log('### TESTs begin');

  global._mockJest.descriptions.forEach(function (description) {
    console.log('Description::: Start:', description.description);
    var its = [].concat(description.its);

    executeAnIt(its, function () {
      completedDecritpions++;
      console.log('Description::: Finished:', description.description);

      if (completedDecritpions === global._mockJest.descriptions.length) {
        console.log('### All TEST finished, results', global._mockJest);
      }
    });
  });
}

function executeAnIt(its, cbCompleted) {
  var it = its.shift();
  if (!it) {
    cbCompleted();
    return;
  }

  console.log('    it:::', it.description);
  if (it.cbTest.length === 0) {
    it.cbTest();
    executeAnIt(its, cbCompleted);
  } else {
    it.cbTest(function () {
      executeAnIt(its, cbCompleted);
    });
  }
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);