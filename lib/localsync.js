'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = localsync;

var _localStorage = require('local-storage');

var _localStorage2 = _interopRequireDefault(_localStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var should = require('chai').should();

/**
 * Creates a synchronizer which uses localStorage 'storage' event for synchronization between tabs.
 * @param  {string}   key                       The key to synchronize on.
 * @param  {function} action                    The action to run when trigger is executed. Should return the payload to be transmitted to the handlers on other tabs.
 * @param  {function} handler                   The handler which is executed on other tabs when a synchronization is triggered. Argument is the return value of the action.
 * @param  {boolean}  [options.tracing=false]   Option to turn on tracing for debugging.
 * @param  {Object}   [options.logger=console]  The logger to debug to.
 * @param  {string}   [options.logLevel=info]   The log level to trace at.
 * @return {Object}                             localsync instance with start, stop, trigger, isRunning, and isFallback properties.
 */
function localsync(key, action, handler) {
  var _ref = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  var _ref$tracing = _ref.tracing;
  var tracing = _ref$tracing === undefined ? false : _ref$tracing;
  var _ref$logger = _ref.logger;
  var logger = _ref$logger === undefined ? console : _ref$logger;
  var _ref$logLevel = _ref.logLevel;
  var logLevel = _ref$logLevel === undefined ? 'info' : _ref$logLevel;

  should.exist(key);
  should.exist(action);
  should.exist(handler);
  var log = function log() {
    return tracing ? logger[logLevel].apply(logger, arguments) : function () {};
  };
  var isRunning = false;

  var trigger = function trigger() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    log('localsync#trigger', args);
    var value = action.apply(undefined, args);
    (0, _localStorage2.default)(key, value);
  };

  var start = function start() {
    log('localsync#start');
    _localStorage2.default.on(key, handler);
    isRunning = true;
  };

  var stop = function stop() {
    log('localsync#stop');
    _localStorage2.default.off(key, handler);
    isRunning = false;
  };

  return { start: start,
    stop: stop,
    trigger: trigger,
    get isRunning() {
      return isRunning;
    },
    isFallback: false
  };
}