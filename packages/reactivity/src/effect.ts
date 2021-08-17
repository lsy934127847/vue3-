import { isArray, isInteger } from "@vue/shared";

export function effect(fn,options:any = {}){

 let effect  = createReactiveEffect(fn,options)
 if(!options.lazy){
    effect();
 }

 return effect
}
let uid= 0
let activeEffect
function createReactiveEffect(fn,options){


     const effect = function(){
        activeEffect = effect
        fn()  // 执行用户传入的函数时 会执行get
        // activeEffect = null
     }
     effect.id = uid++  // 每一个effect都有一个唯一的标识(watcher)
     effect._isEffect = true
     effect.raw = fn
     effect.deps = {}
     effect.options = options
     return effect
}

const targetMap = new WeakMap()
export function track(target,types,key){

   if(!activeEffect){
       // 说明取值操作时再effect之外操作的
       return 
   }

  let deepsMap =   targetMap.get(target)
  if(!deepsMap){
    targetMap.set(target,(deepsMap = new Map()))
  }
  let dep =  deepsMap.get(key)
  if(!dep){
    deepsMap.set(key,(dep = new Set))
  }

  if(!dep.has(activeEffect)){
    dep.add(activeEffect)
  }
}

export function trigger(target,key,value,type){

    let deepsMap = targetMap.get(target)
    if(!deepsMap){
            return 
    }
    // 如果修改的是数组 并且改的是长度 
    if(isArray(target) && key == "length"){
          deepsMap.forEach( (dep,key) =>{
              if(key == "length" || value < key){
                  dep.forEach( effects =>effects())
              }
          })
    }else {
        if(type == "add"){
            //新增逻辑 需要触发更新
                if(isArray(target) && isInteger(key)){
                    let effects = deepsMap.get("length")
                    effects && effects.forEach(effect =>effect())
                }
        }
        const effects = deepsMap.get(key)

        effects && effects.forEach( (effect) =>{
            effect()
        })
    }
  
   // activeEffect()
}