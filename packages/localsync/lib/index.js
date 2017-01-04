'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = localsync;
var navigator = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' ? window.navigator : function () {}();

function isEdgeOrIE() {
  if (!navigator) return false;
  return navigator.appName === 'Microsoft Internet Explorer' || navigator.appName === 'Netscape' && /(Trident|Edge)/i.test(navigator.appVersion);
}

function localsync() {
  var _require, _ref;

  if (typeof navigator === 'undefined') return (_require = require('serversync')).default.apply(_require, arguments);
  return (_ref = isEdgeOrIE() ? require('cookiesync') : require('storagesync')).default.apply(_ref, arguments);
}