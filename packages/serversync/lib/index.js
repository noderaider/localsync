'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = serversync;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mechanism = 'serversync';

/**
 * Creates a mock synchronizer which uses a server safe interface equivalent to serversync
 * @param  {string}   key                       The key to synchronize on.
 * @param  {function} action                    The action to run when trigger is executed. Should return the payload to be transmitted to the handlers on other tabs.
 * @param  {function} handler                   The handler which is executed on other tabs when a synchronization is triggered. Argument is the return value of the action.
 * @param  {boolean}  [options.tracing=false]   Option to turn on tracing for debugging.
 * @param  {Object}   [options.logger=console]  The logger to debug to.
 * @param  {string}   [options.logLevel=info]   The log level to trace at.
 * @return {Object}                             serversync instance with start, stop, trigger, isRunning, and isFallback mock properties.
 */
function serversync(key, action, handler) {
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

  var trigger = function trigger() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    log('serversync#trigger', args);
    var value = action.apply(undefined, args);
    log('serversync#trigger action output ignored', args, value);
  };

  var start = function start() {
    log('serversync#start');
    isRunning = true;
  };

  var stop = function stop() {
    log('serversync#stop');
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
    isServer: true
  };
}