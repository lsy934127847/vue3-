export const isObject = (val) => typeof val == "object" && val !== null;
export const isNumber = (val) => typeof val == "number";
export const isFunction = (val) => typeof val == "function";
export const isString = (val) => typeof val == "string";
export const isArray =Array.isArray;
export const isBoolean = (val) => typeof val == "boolean";
export const extend = Object.assign;

export const hasOwn = (target,key) => Object.prototype.hasOwnProperty.call(target,key)
export const hasChanged =(oldValue,value) =>oldValue !== value
export const isInteger = (key) => parseInt(key) + "" === key