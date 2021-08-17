import { mutableHandlers, readonlyHandlers, shallowReaciveHandlers, shallowReadonlyHandlers } from "./baseHandlers"
import {isObject} from "@vue/shared"


const reactiveMap = new WeakMap()  // 弱引用 对象key不能用对象  map可以是对象
// weakmap 中的key只能是对象 如果引用的key被置为null weakmap会自动回收
const readonlyMap = new WeakMap()

const shallowReadonlyMap = new  WeakMap()

const shallowReactiveMap = new  WeakMap()

export function reactive(target:object){
           return createReactiveObject(target,mutableHandlers,reactiveMap)
}

export function shallowReacive(target:object){
    return createReactiveObject(target,shallowReaciveHandlers,shallowReactiveMap)
}

export function readonly(target:object){
    return createReactiveObject(target,readonlyHandlers,readonlyMap)
}

export function shallowReadonly(target:object){
    return createReactiveObject(target,shallowReadonlyHandlers,shallowReadonlyMap)
}



export function createReactiveObject(target,baseHandlers,proxyMap){
        
    if(!isObject(target)){
        return target
    }

    // 创建代理对象 
    // const ProxyMap = isReadonly ? readonlyMap : reactiveMap
    const existsProxy = proxyMap.get(target)
    if(existsProxy){
        return existsProxy
    }
    const proxy = new Proxy(target,baseHandlers)
    reactiveMap.set(target,proxy)
    return proxy
}