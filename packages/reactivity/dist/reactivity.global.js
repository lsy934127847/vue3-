var Vuereactivity = (function (exports) {
  'use strict';

  const isObject = (val) => typeof val == "object" && val !== null;
  const isArray = Array.isArray;
  const hasOwn = (target, key) => Object.prototype.hasOwnProperty.call(target, key);
  const hasChanged = (oldValue, value) => oldValue !== value;
  const isInteger = (key) => parseInt(key) + "" === key;

  function effect(fn, options = {}) {
      let effect = createReactiveEffect(fn, options);
      if (!options.lazy) {
          effect();
      }
      return effect;
  }
  let uid = 0;
  let activeEffect;
  function createReactiveEffect(fn, options) {
      const effect = function () {
          activeEffect = effect;
          fn(); // 执行用户传入的函数时 会执行get
          // activeEffect = null
      };
      effect.id = uid++; // 每一个effect都有一个唯一的标识(watcher)
      effect._isEffect = true;
      effect.raw = fn;
      effect.deps = {};
      effect.options = options;
      return effect;
  }
  const targetMap = new WeakMap();
  function track(target, types, key) {
      if (!activeEffect) {
          // 说明取值操作时再effect之外操作的
          return;
      }
      let deepsMap = targetMap.get(target);
      if (!deepsMap) {
          targetMap.set(target, (deepsMap = new Map()));
      }
      let dep = deepsMap.get(key);
      if (!dep) {
          deepsMap.set(key, (dep = new Set));
      }
      if (!dep.has(activeEffect)) {
          dep.add(activeEffect);
      }
  }
  function trigger(target, key, value, type) {
      let deepsMap = targetMap.get(target);
      if (!deepsMap) {
          return;
      }
      // 如果修改的是数组 并且改的是长度 
      if (isArray(target) && key == "length") {
          deepsMap.forEach((dep, key) => {
              if (key == "length" || value < key) {
                  dep.forEach(effects => effects());
              }
          });
      }
      else {
          if (type == "add") {
              //新增逻辑 需要触发更新
              if (isArray(target) && isInteger(key)) {
                  let effects = deepsMap.get("length");
                  effects && effects.forEach(effect => effect());
              }
          }
          const effects = deepsMap.get(key);
          effects && effects.forEach((effect) => {
              effect();
          });
      }
      // activeEffect()
  }

  const get = createGetter();
  const readonlyGet = createGetter(true); // 仅读get
  const shallowGet = createGetter(false, true); //
  const shallowReadonlyGet = createGetter(true, true);
  const set = createSetter();
  function createSetter() {
      return function set(target, key, value, receiver) {
          let oldValue = target[key];
          let hadKey = isArray(target) && isInteger(key) ? key < target.length : hasOwn(target, key);
          let res = Reflect.set(target, key, value, receiver);
          if (!hadKey) ;
          else if (hasChanged(oldValue, value)) {
              trigger(target, key, value, "add");
          }
          console.log("res", res);
          // 触发视图更新
          return res;
      };
  }
  function createGetter(isReadonly = false, shallow = false) {
      // 目标 属性 代理对象
      return function get(target, key, receiver) {
          let res = Reflect.get(target, key, receiver);
          if (!isReadonly) {
              // 不是仅读 才去搜集依赖
              track(target, "get", key);
          }
          if (shallow) {
              return res;
          }
          if (isObject(res)) { // 如果是对象就递归代理 当用到这个对象的时候才去代理
              // {name:"lsy",age:{p1:25}} 当取到age的时候才去代理
              return isReadonly ? readonly(res) : reactive(res); // 懒代理
          }
          return res;
      };
  }
  const mutableHandlers = {
      //
      get,
      set,
  };
  const shallowReaciveHandlers = {
      get: shallowGet,
      set
  };
  const readonlyHandlers = {
      get: readonlyGet,
      set
  };
  const shallowReadonlyHandlers = {
      get: shallowReadonlyGet,
      set
  };

  const reactiveMap = new WeakMap(); // 弱引用 对象key不能用对象  map可以是对象
  // weakmap 中的key只能是对象 如果引用的key被置为null weakmap会自动回收
  const readonlyMap = new WeakMap();
  const shallowReadonlyMap = new WeakMap();
  const shallowReactiveMap = new WeakMap();
  function reactive(target) {
      return createReactiveObject(target, mutableHandlers, reactiveMap);
  }
  function shallowReacive(target) {
      return createReactiveObject(target, shallowReaciveHandlers, shallowReactiveMap);
  }
  function readonly(target) {
      return createReactiveObject(target, readonlyHandlers, readonlyMap);
  }
  function shallowReadonly(target) {
      return createReactiveObject(target, shallowReadonlyHandlers, shallowReadonlyMap);
  }
  function createReactiveObject(target, baseHandlers, proxyMap) {
      if (!isObject(target)) {
          return target;
      }
      // 创建代理对象 
      // const ProxyMap = isReadonly ? readonlyMap : reactiveMap
      const existsProxy = proxyMap.get(target);
      if (existsProxy) {
          return existsProxy;
      }
      const proxy = new Proxy(target, baseHandlers);
      reactiveMap.set(target, proxy);
      return proxy;
  }

  exports.effect = effect;
  exports.reactive = reactive;
  exports.readonly = readonly;
  exports.shallowReacive = shallowReacive;
  exports.shallowReadonly = shallowReadonly;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
//# sourceMappingURL=reactivity.global.js.map
