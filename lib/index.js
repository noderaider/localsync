'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var navigator = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' ? window.navigator : null;
function isEdgeOrIE() {
  if (!navigator) return false;
  return navigator.appName === 'Microsoft Internet Explorer' || navigator.appName === 'Netscape' && /(Trident|Edge)/i.test(navigator.appVersion);
}

exports.default = function () {
  var _ref;

  return (_ref = isEdgeOrIE() ? require('./cookiesync') : require('./localsync')).default.apply(_ref, arguments);
};