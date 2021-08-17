

// 如果采用相对路径进行打包 那么当前模块在打包的时候会将这个shared打包到自己的模块
//import {VueShared} from "../../shared/src/index"
import {isObject} from "@vue/shared"

import {readonly,reactive,shallowReacive,shallowReadonly} from './reactive'


export {
    readonly,reactive,shallowReacive,shallowReadonly
} from "./reactive"

export {
    effect
} from "./effect"


