
exports.defineOnlyGet = function(object,key,defaultValue){
    Object.defineProperty(object,key,{
        set:function(value){
            const message = `\n====================WARNING====================\n\n property ${key} is readonly property \n\n You can not change a readonly property!\n this will has not any effort!`
            console.error(message);
        },
        get:function(){
            return this[Symbol.for(key)] = this[Symbol.for(key)] ? this[Symbol.for(key)] : defaultValue;
        }
    });
}


exports.defineProperty = function(object,key,defaultValue){
    Object.defineProperty(object,key,{
        set:function(value){
            this[Symbol.for(key)] = value;
        },
        get:function(){
            return this[Symbol.for(key)] = this[Symbol.for(key)] ? this[Symbol.for(key)] : defaultValue;
        }
    });
}

exports.inherits = function(Child, Parent) {
    const f = {};
    f.prototype = Parent.prototype;
    Child.prototype = f;
    Child.prototype.constructor = Child;
}