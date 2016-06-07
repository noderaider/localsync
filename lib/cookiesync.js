'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cookiesync;

var _reactCookie = require('react-cookie');

var _reactCookie2 = _interopRequireDefault(_reactCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var should = require('chai').should();

/**
 * Creates a synchronizer which uses cookie polling to transmit objects to other tabs.
 * @param  {string}             key               The key to synchronize on.
 * @param  {function} action            The action to run when trigger is executed. Should return the payload to be transmitted to the handlers on other tabs.
 * @param  {function}   handler           The handler which is executed on other tabs when a synchronization is triggered. Argument is the return value of the action.
 * @param  {boolean} [options.tracing=false]      Option to turn on tracing for debugging.
 * @param  {Object}  [options.logger=console]     The logger to debug to.
 * @param  {string}  [options.logLevel=info]      The log level to trace at.
 * @param  {number}  [options.idLength=8]         The number of characters to use for unique instance ID.
 * @param  {number}  [options.pollFrequency=3000] The frequency (in milliseconds) to poll at.
 * @param  {string}  [options.path='/']           The path to store the cookie at.
 * @param  {boolean} [options.secure=false]       Flag to set the cookies secure flag.
 * @param  {boolean} [options.httpOnly=false]     Flag to set the cookies httpOnly flag.
 */
function cookiesync(key, action, handler) {
  var _ref = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  var _ref$tracing = _ref.tracing;
  var tracing = _ref$tracing === undefined ? false : _ref$tracing;
  var _ref$logger = _ref.logger;
  var logger = _ref$logger === undefined ? console : _ref$logger;
  var _ref$logLevel = _ref.logLevel;
  var logLevel = _ref$logLevel === undefined ? 'info' : _ref$logLevel;
  var _ref$idLength = _ref.idLength;
  var idLength = _ref$idLength === undefined ? 8 : _ref$idLength;
  var _ref$pollFrequency = _ref.pollFrequency;
  var pollFrequency = _ref$pollFrequency === undefined ? 3000 : _ref$pollFrequency;
  var _ref$path = _ref.path;
  var path = _ref$path === undefined ? '/' : _ref$path;
  var _ref$secure = _ref.secure;
  var secure = _ref$secure === undefined ? false : _ref$secure;
  var _ref$httpOnly = _ref.httpOnly;
  var httpOnly = _ref$httpOnly === undefined ? false : _ref$httpOnly;

  should.exist(key);
  should.exist(action);
  should.exist(handler);
  var log = function log() {
    return tracing ? logger[logLevel].apply(logger, arguments) : function () {};
  };
  var cookieOpts = { path: path, secure: secure, httpOnly: httpOnly };
  var cookieKey = 'localsync_fallback_' + key;
  var instanceID = function (N) {
    return (Math.random().toString(36) + '00000000000000000').slice(2, N + 2);
  }(idLength);
  var loadCookie = function loadCookie() {
    try {
      var value = _reactCookie2.default.load(cookieKey, false);
      if (typeof value !== 'undefined') {
        var _instanceID = value.instanceID;
        var payload = value.payload;

        should.exist(_instanceID, 'cookiesync cookies must have an instanceID associated => ' + JSON.stringify(value));
        _instanceID.should.be.a('string').and.have.lengthOf(idLength);
        should.exist(payload, 'cookiesync cookies must have a payload associated => ' + JSON.stringify(value));
      }
      log('cookiesync#loadCookie', value);
      return value;
    } catch (err) {
      logger.error(err, 'cookiesync#loadCookie => error occurred in cookiesync, wiping cookie with key ' + cookieKey);
      _reactCookie2.default.remove(cookieKey);
    }
  };
  var saveCookie = function saveCookie() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    args.should.be.lengthOf(1);
    var payload = args[0];

    var value = { instanceID: instanceID, payload: payload };
    log('cookisync#saveCookie', instanceID, payload);
    _reactCookie2.default.save(cookieKey, value, cookieOpts);
  };

  var isRunning = false;
  var trigger = function trigger() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    log.apply(undefined, ['cookiesync#trigger', instanceID].concat(args));
    var payload = action.apply(undefined, args);
    log('cookiesync#trigger => payload', payload);
    saveCookie(payload);
  };

  var intervalID = null;
  var start = function start() {
    log('cookiesync#start', instanceID);
    var last = loadCookie();
    if (!last) {
      log('cookiesync#start: nolast', instanceID);
      last = { instanceID: instanceID };
      saveCookie(last);
    }
    intervalID = setInterval(function () {
      log('cookiesync#poll', instanceID);
      var current = loadCookie();
      if (!current) {
        log('cookiesync#poll: nocurrent', instanceID);
        current = last;
        saveCookie(current);
      }
      /** DONT NOTIFY IF SAME TAB */
      if (current.instanceID === instanceID) {
        log('cookiesync#poll: sameinstance', instanceID);
        return;
      }

      if (JSON.stringify(last.payload) != JSON.stringify(current.payload)) {
        log('cookiesync#poll: INVOKE|instanceID =', instanceID, '|current.instanceID =', current.instanceID, '|last.instanceID =', last.instanceID, '|last.payload =', JSON.stringify(last.payload), '|current.payload =', JSON.stringify(current.payload));
        handler(current.payload);
        last = current;
      } else {
        log('cookiesync#poll: noinvoke|instanceID =', instanceID, '|current.instanceID =', current.instanceID, '|last.instanceID =', last.instanceID, '|last.payload =', JSON.stringify(last.payload), '|current.payload =', JSON.stringify(current.payload));
      }
    }, pollFrequency);
    isRunning = true;
  };

  var stop = function stop() {
    log('cookiesync#stop', instanceID);
    clearInterval(intervalID);
    isRunning = false;
  };

  return { start: start,
    stop: stop,
    trigger: trigger,
    get isRunning() {
      return isRunning;
    },
    isFallback: true,
    instanceID: instanceID
  };
}