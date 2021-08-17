
const fs = require("fs")
const execa = require("execa") // 单独开一个子进程进行打包
// 1.希望拿到packages下的所有包

// [reactivity,shared]
const targets = fs.readdirSync("packages").filter( item =>{
       //  判断是文件还是文件夹   directory : 目录 文件夹
       return fs.statSync(`packages/${item}`).isDirectory()   
})         
console.log(targets)

async function build(target){
    console.log("打包" + target)
    return execa("rollup",["-c","--environment","TARGET:"+target],{
        stdio:"inherit"    // 子进程的输出结果 到父进程中
    })
}
function runAll(targets){
    let results = []
    for(let target of targets){
        results.push(build(target))
         
    }
    return Promise.all(results)  // 并行打包
}



// 打包这些文件
runAll(targets).then( () =>{
    console.log("打包完毕")
})