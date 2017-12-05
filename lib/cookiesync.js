"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var invariant = require("invariant");
var Cookies = require("universal-cookie");
var mechanism = "cookiesync";
/**
 * Creates a synchronizer which uses cookie polling to transmit objects to other tabs.
 * @param  {string}   key                           The key to synchronize on.
 * @param  {function} action                        The action to run when trigger is executed. Should return the payload to be transmitted to the handlers on other tabs.
 * @param  {function} handler                       The handler which is executed on other tabs when a synchronization is triggered. Argument is the return value of the action.
 * @param  {boolean}  [options.tracing=false]       Option to turn on tracing for debugging.
 * @param  {Object}   [options.logger=console]      The logger to debug to.
 * @param  {string}   [options.logLevel=info]       The log level to trace at.
 * @param  {number}   [options.idLength=8]          The number of characters to use for unique instance ID.
 * @param  {number}   [options.pollFrequency=3000]  The frequency (in milliseconds) to poll at.
 * @param  {string}   [options.path='/']            The path to store the cookie at.
 * @param  {boolean}  [options.secure=false]        Flag to set the cookies secure flag.
 * @param  {boolean}  [options.httpOnly=false]      Flag to set the cookies httpOnly flag.
 * @return {Object}                                 cookiesync instance with start, stop, trigger, isRunning, isFallback, and instanceID properties.
 */
function cookiesync(key, action, handler, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.tracing, tracing = _c === void 0 ? false : _c, _d = _b.logger, logger = _d === void 0 ? console : _d, _e = _b.logLevel, logLevel = _e === void 0 ? "info" : _e, _f = _b.idLength, idLength = _f === void 0 ? 8 : _f, _g = _b.pollFrequency, pollFrequency = _g === void 0 ? 3000 : _g, _h = _b.path, path = _h === void 0 ? "/" : _h, _j = _b.secure, secure = _j === void 0 ? false : _j, _k = _b.httpOnly, httpOnly = _k === void 0 ? false : _k;
    invariant(key, "key is required");
    invariant(action, "action is required");
    invariant(handler, "handler is required");
    var cookies = new Cookies();
    var log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return tracing ? logger[logLevel].apply(logger, args) : function () { };
    };
    var cookieOpts = { path: path, secure: secure, httpOnly: httpOnly };
    var cookieKey = "cookiesync_fallback_" + key;
    var instanceID = (function (N) { return (Math.random().toString(36) + "00000000000000000").slice(2, N + 2); })(idLength);
    var loadCookie = function () {
        try {
            var value = cookies.get(cookieKey, { doNotParse: false });
            if (typeof value !== "undefined") {
                var instanceID_1 = value.instanceID, payload = value.payload;
                invariant(instanceID_1, "cookiesync cookies must have an instanceID associated => " + JSON.stringify(value));
                invariant(typeof instanceID_1 === "string" && instanceID_1.length === idLength, "instanceID must be a string");
                invariant(payload, "cookiesync cookies must have a payload associated => " + JSON.stringify(value));
            }
            log("cookiesync#loadCookie", value);
            return value;
        }
        catch (err) {
            logger.error(err, "cookiesync#loadCookie => error occurred in cookiesync, wiping cookie with key " + cookieKey);
            cookies.remove(cookieKey);
        }
    };
    var saveCookie = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        invariant(args.length === 1, "should only have one argument");
        var payload = args[0];
        var value = { instanceID: instanceID, payload: payload };
        log("cookisync#saveCookie", instanceID, payload);
        cookies.set(cookieKey, value, cookieOpts);
    };
    var isRunning = false;
    var trigger = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        log.apply(void 0, ["cookiesync#trigger", instanceID].concat(args));
        var payload = action.apply(void 0, args);
        log("cookiesync#trigger => payload", payload);
        saveCookie(payload);
    };
    var intervalID = null;
    var start = function (sync) {
        if (sync === void 0) { sync = false; }
        log("cookiesync#start", instanceID);
        var last = loadCookie();
        if (!last) {
            log("cookiesync#start: nolast", instanceID);
            last = { instanceID: instanceID };
            saveCookie(last);
        }
        intervalID = setInterval(function () {
            log("cookiesync#poll", instanceID);
            var current = loadCookie();
            if (!current) {
                log("cookiesync#poll: nocurrent", instanceID);
                current = last;
                saveCookie(current);
            }
            /** DONT NOTIFY IF SAME TAB */
            if (current.instanceID === instanceID) {
                log("cookiesync#poll: sameinstance", instanceID);
                return;
            }
            if (JSON.stringify(last.payload) != JSON.stringify(current.payload)) {
                log("cookiesync#poll: INVOKE|instanceID =", instanceID, "|current.instanceID =", current.instanceID, "|last.instanceID =", last.instanceID, "|last.payload =", JSON.stringify(last.payload), "|current.payload =", JSON.stringify(current.payload));
                handler(current.payload, last ? last.payload : {}, last ? (last.url || "") : "");
                last = current;
            }
            else {
                log("cookiesync#poll: noinvoke|instanceID =", instanceID, "|current.instanceID =", current.instanceID, "|last.instanceID =", last.instanceID, "|last.payload =", JSON.stringify(last.payload), "|current.payload =", JSON.stringify(current.payload));
            }
        }, pollFrequency);
        if (sync) {
            var current = loadCookie();
            handler(current.payload, last ? last.payload : {}, last ? (last.url || "") : "");
            last = current;
        }
        isRunning = true;
    };
    var stop = function () {
        log("cookiesync#stop", instanceID);
        clearInterval(intervalID);
        isRunning = false;
    };
    return { start: start,
        stop: stop,
        trigger: trigger,
        get isRunning() { return isRunning; },
        mechanism: mechanism,
        isFallback: true,
        isServer: false,
        instanceID: instanceID
    };
}
exports.default = cookiesync;
