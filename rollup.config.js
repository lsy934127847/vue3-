

let path = require("path")
let ts = require("rollup-plugin-typescript2")
let resolvePlugin = require("@rollup/plugin-node-resolve").default
let packagesDir = path.resolve(__dirname,"packages")
const name = process.env.TARGET
console.log("name",name)
const packageDir = path.resolve(packagesDir,name)

console.log(packageDir)
const  currentResolve = (p) =>path.resolve(packageDir,p)

const pkg =currentResolve("package.json")

const pkgContent = require(pkg)

const options = pkgContent.buildOptions

console.log("options",options)
const outputConfig = {
    cjs:{
        file:currentResolve(`dist/${name}.cjs.js`)
    },
    global:{
        file:currentResolve(`dist/${name}.global.js`),
        format:"iife"
    },
    "esm-bundler":{
        file:currentResolve(`dist/${name}.esm-bundler.js`),
        format:"esm"
    }
}
function createConfig(output){
    output.name = options.name
    output.sourcemap = true
   return {
     
       input:currentResolve("src/index.ts"),
       output,
       plugins:[
           ts({ // 打包时调用ts的配置文件
               tsconfig:path.resolve(__dirname,"tsconfig.json")
           }),
           resolvePlugin() // 解析后缀
       ]
   }
}
export default options.formats.map(f =>createConfig(outputConfig[f]))