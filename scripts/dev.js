
// 开发使用


const fs = require("fs")
const execa = require("execa") // 单独开一个子进程进行打包


const target = "reactivity" // 开发指定具体哪个模块

async function build(target){
    console.log("打包" + target)
    return execa("rollup",["-cw","--environment","TARGET:"+target],{
        stdio:"inherit"    // 子进程的输出结果 到父进程中
    })
}

build(target)

