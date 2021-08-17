import { hasChanged, hasOwn, isArray, isInteger, isObject } from "../../shared/src/index";
import { reactive, readonly } from "./reactive";
import { track, trigger } from "./effect"
const get = createGetter();
const readonlyGet = createGetter(true); // 仅读get
const shallowGet = createGetter(false, true); //
const shallowReadonlyGet = createGetter(true, true);

const set = createSetter()


function createSetter(){
  return function set(target,key,value,receiver){

    let oldValue = target[key]

    let hadKey =  isArray(target) && isInteger(key) ? key < target.length :hasOwn(target,key)

    

    let res = Reflect.set(target,key,value,receiver)

    if(!hadKey) {
      // 新增
   }else if(hasChanged(oldValue,value)){
     trigger(target,key,value,"add")
   }

  
    console.log("res",res)
    // 触发视图更新
     return res
  }
}

function createGetter(isReadonly = false, shallow = false) {
  // 目标 属性 代理对象
  return function get(target, key, receiver) {
    let res = Reflect.get(target, key, receiver);

    if (!isReadonly) {
      // 不是仅读 才去搜集依赖
      track(target,"get",key)
    }
    if (shallow) {
      return res;
    }

    if (isObject(res)) {  // 如果是对象就递归代理 当用到这个对象的时候才去代理
      // {name:"lsy",age:{p1:25}} 当取到age的时候才去代理
      return isReadonly ? readonly(res) : reactive(res); // 懒代理
    }

    return res
  };
}


export const mutableHandlers = {
  //

  get,
  set,
};
export const shallowReaciveHandlers = {
  get: shallowGet,
  set
};
export const readonlyHandlers = {
  get: readonlyGet,
  set
  
};
export const shallowReadonlyHandlers = {
  get: shallowReadonlyGet,
  set
};
