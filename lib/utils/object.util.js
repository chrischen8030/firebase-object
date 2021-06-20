"use strict";

exports.defineOnlyGet = function (object, key, defaultValue) {
    Object.defineProperty(object, key, {
        get: function get() {
            return this[Symbol.for(key)] = this[Symbol.for(key)] ? this[Symbol.for(key)] : defaultValue;
        }
    });
};

exports.defineProperty = function (object, key, defaultValue) {
    Object.defineProperty(object, key, {
        set: function set(value) {
            this[Symbol.for(key)] = value;
        },
        get: function get() {
            return this[Symbol.for(key)] = this[Symbol.for(key)] ? this[Symbol.for(key)] : defaultValue;
        }
    });
};