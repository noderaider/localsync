'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.default = localsync;

var _localStorage = require('local-storage');

var _localStorage2 = _interopRequireDefault(_localStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var should = require('chai').should();

var navigator = (typeof window === 'undefined' ? 'undefined' : (0, _typeof3.default)(window)) === 'object' ? window.navigator : null;
function isEdgeOrIE() {
  if (!navigator) return false;
  return navigator.appName === 'Microsoft Internet Explorer' || navigator.appName === 'Netscape' && navigator.appVersion.indexOf('Trident') > -1;
}

function cookiesync(key, action, handler) {
  var _ref = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  var _ref$pollFrequency = _ref.pollFrequency;
  var pollFrequency = _ref$pollFrequency === undefined ? 3000 : _ref$pollFrequency;

  var cookie = require('react-cookie');
  var cookieKey = 'localsync_fb_' + key;
  var instanceID = function (N) {
    return (Math.random().toString(36) + '00000000000000000').slice(2, N + 2);
  }(8);
  var loadCookie = function loadCookie() {
    return cookie.load(cookieKey);
  };
  var saveCookie = function saveCookie(value) {
    return cookie.save(cookieKey, value);
  };

  var isRunning = false;
  var trigger = function trigger() {
    var value = action.apply(undefined, arguments);
    saveCookie(cookieKey, value);
  };

  var intervalID = null;
  var start = function start() {
    var last = loadCookie();
    if (!last) {
      last = { instanceID: instanceID };
      saveCookie(last);
    }
    intervalID = setInterval(function () {
      var current = loadCookie();
      if (!current) {
        current = last;
        saveCookie(current);
      }
      /** DONT NOTIFY IF SAME TAB */
      if (current.instanceID === instanceID) return;

      var lastValue = last.value;
      var currentValue = current.value;
      if (lastValue !== currentValue) handler(currentValue);
      lastValue = currentValue;
    }, pollFrequency);
    isRunning = true;
  };

  var stop = function stop() {
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

function localsync(key, action, handler) {
  var opts = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  should.exist(key);
  should.exist(action);
  should.exist(handler);

  if (isEdgeOrIE()) return cookiesync(key, action, handler, opts);

  var isRunning = false;

  var trigger = function trigger() {
    var value = action.apply(undefined, arguments);
    (0, _localStorage2.default)(key, value);
  };

  var start = function start() {
    _localStorage2.default.on(key, handler);
    isRunning = true;
  };

  var stop = function stop() {
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