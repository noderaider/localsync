"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var invariant = require("invariant");
var ls = require("local-storage");
var mechanism = "storagesync";
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
function storagesync(key, action, handler, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.tracing, tracing = _c === void 0 ? false : _c, _d = _b.logger, logger = _d === void 0 ? console : _d, _e = _b.logLevel, logLevel = _e === void 0 ? "info" : _e;
    invariant(key, "key is required");
    invariant(action, "action is required");
    invariant(handler, "handler is required");
    var log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return tracing ? logger[logLevel].apply(logger, args) : function () { };
    };
    var isRunning = false;
    var last = {};
    var trigger = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        log("storagesync#trigger", args);
        var value = action.apply(void 0, args);
        ls(key, value);
    };
    var start = function (sync) {
        if (sync === void 0) { sync = false; }
        log("storagesync#start");
        ls.on(key, function (value) {
            handler(value, last, "");
            last = value;
        });
        if (sync) {
            var value = ls.get(key);
            handler(value, last, "");
            last = value;
        }
        isRunning = true;
    };
    var stop = function () {
        log("storagesync#stop");
        ls.off(key, handler);
        isRunning = false;
    };
    return { start: start,
        stop: stop,
        trigger: trigger,
        get isRunning() { return isRunning; },
        mechanism: mechanism,
        isFallback: false,
        isServer: false
    };
}
exports.default = storagesync;
