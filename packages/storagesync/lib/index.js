'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = storagesync;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _localStorage = require('local-storage');

var _localStorage2 = _interopRequireDefault(_localStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mechanism = 'storagesync';

/**
 * Creates a synchronizer which uses localStorage 'storage' event for synchronization between tabs.
 * @param  {string}   key                       The key to synchronize on.
 * @param  {function} action                    The action to run when trigger is executed. Should return the payload to be transmitted to the handlers on other tabs.
 * @param  {function} handler                   The handler which is executed on other tabs when a synchronization is triggered. Argument is the return value of the action.
 * @param  {boolean}  [options.tracing=false]   Option to turn on tracing for debugging.
 * @param  {Object}   [options.logger=console]  The logger to debug to.
 * @param  {string}   [options.logLevel=info]   The log level to trace at.
 * @return {Object}                             storagesync instance with start, stop, trigger, isRunning, and isFallback properties.
 */
function storagesync(key, action, handler) {
  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$tracing = _ref.tracing,
      tracing = _ref$tracing === undefined ? false : _ref$tracing,
      _ref$logger = _ref.logger,
      logger = _ref$logger === undefined ? console : _ref$logger,
      _ref$logLevel = _ref.logLevel,
      logLevel = _ref$logLevel === undefined ? 'info' : _ref$logLevel;

  (0, _invariant2.default)(key, 'key is required');
  (0, _invariant2.default)(action, 'action is required');
  (0, _invariant2.default)(handler, 'handler is required');
  var log = function log() {
    return tracing ? logger[logLevel].apply(logger, arguments) : function () {};
  };
  var isRunning = false;
  var last = {};

  var trigger = function trigger() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    log('storagesync#trigger', args);
    var value = action.apply(undefined, args);
    (0, _localStorage2.default)(key, value);
  };

  var start = function start() {
    var sync = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    log('storagesync#start');
    _localStorage2.default.on(key, function (value) {
      handler(value, last, '');
      last = value;
    });
    if (sync) {
      var value = _localStorage2.default.get(key);
      handler(value, last, '');
      last = value;
    }
    isRunning = true;
  };

  var stop = function stop() {
    log('storagesync#stop');
    _localStorage2.default.off(key, handler);
    isRunning = false;
  };

  return { start: start,
    stop: stop,
    trigger: trigger,
    get isRunning() {
      return isRunning;
    },
    mechanism: mechanism,
    isFallback: false,
    isServer: false
  };
}