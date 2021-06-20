'use strict';

var utils = require('../utils/object.util');
exports.FirebaseModel = void 0;
var FirebaseModel = /** class */function () {
    function FirebaseModel(firebase, id) {
        if (firebase && firebase.firestore instanceof Function) {
            this.firebase = firebase;
            this.fireStore = firebase.firestore();
            this[Symbol.for('id')] = id;
        } else {
            // TODO: error
        }
    }
    Object.defineProperty(FirebaseModel.prototype, 'data', {
        set: function set(data) {
            // this[Symbol.for(`data`)] = data;
            // TODO:error 
            console.log('error: you can not set data');
        },
        get: function get() {
            return this[Symbol.for('data')] = this[Symbol.for('data')] ? this[Symbol.for('data')] : {};
        }
    });
    utils.defineOnlyGet(FirebaseModel.prototype, 'paths', []);
    utils.defineOnlyGet(FirebaseModel.prototype, 'id', '');
    Object.defineProperty(FirebaseModel.prototype, 'save', {
        value: async function value() {
            console.log(this.paths);
            if (this.id) {
                if (this.paths[this.paths.length - 1] !== '' + this.id) {
                    this.paths.push('' + this.id);
                }
                this.fireStore.doc(this.paths.join('/')).set(this.data, {
                    merge: true
                });
            } else {
                var doc = await this.fireStore.collection(this.paths.join('/')).add(this.data, {
                    merge: true
                });
                console.log(doc);
                this[Symbol.for('id')] = doc.id;
                this.paths.push('' + doc.id);
            }
        }
    });
    Object.defineProperty(FirebaseModel.prototype, 'get', {
        value: async function value() {
            if (this.paths[this.paths.length - 1] !== '' + this.id) {
                this.paths.push('' + this.id);
            }
            if (this.id) {
                var doc = await this.fireStore.doc(this.paths.join('/')).get();
                this[Symbol.for('data')] = doc.data();
            }
        }
    });
    return FirebaseModel;
}();

exports.FirebaseModel = FirebaseModel;