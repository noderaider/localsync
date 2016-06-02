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

var createInstanceID = function createInstanceID() {
  var N = arguments.length <= 0 || arguments[0] === undefined ? 8 : arguments[0];
  return (Math.random().toString(36) + '00000000000000000').slice(2, N + 2);
};

var createCookieKey = function createCookieKey(key) {
  return 'localsync_fb_' + key;
};

function cookiesync(key, sync, handler) {
  var _ref = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  var _ref$pollFrequency = _ref.pollFrequency;
  var pollFrequency = _ref$pollFrequency === undefined ? 3000 : _ref$pollFrequency;

  var cookie = require('react-cookie');
  var cookieKey = createCookieKey(key);
  var instanceID = createInstanceID();
  var isSyncRunning = false;

  var loadCookie = function loadCookie() {
    return cookie.load(cookieKey);
  };
  var saveCookie = function saveCookie(value) {
    return cookie.save(cookieKey, value);
  };

  var triggerSync = function triggerSync() {
    var value = sync.apply(undefined, arguments);
    saveCookie(cookieKey, value);
  };

  var intervalID = null;
  var startSync = function startSync() {
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
    isSyncRunning = true;
  };

  var stopSync = function stopSync() {
    clearInterval(intervalID);
    isSyncRunning = false;
  };

  return { startSync: startSync,
    stopSync: stopSync,
    triggerSync: triggerSync,
    get isSyncRunning() {
      return isSyncRunning;
    },
    isFallback: true,
    instanceID: instanceID
  };
}

function localsync(key, sync, handler) {
  var opts = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  should.exist(key);
  should.exist(sync);
  should.exist(handler);

  if (isEdgeOrIE()) return cookiesync(key, sync, handler, opts);

  var isSyncRunning = false;

  var triggerSync = function triggerSync() {
    var value = sync.apply(undefined, arguments);
    (0, _localStorage2.default)(key, value);
  };

  var startSync = function startSync() {
    _localStorage2.default.on(key, handler);
    isSyncRunning = true;
  };

  var stopSync = function stopSync() {
    _localStorage2.default.off(key, handler);
    isSyncRunning = false;
  };

  return { startSync: startSync,
    stopSync: stopSync,
    triggerSync: triggerSync,
    get isSyncRunning() {
      return isSyncRunning;
    },
    isFallback: false
  };
}