/**
 * context 处理
 * 1. 如果context 为null 或者没有传 就默认指向window
 * 2. context 必须为引用类型的值(如果不是 内部 需要处理)
 *  + number string boolean 都可以基于new它的构造函数 创造对应的引用类型值
 *    如 new Number.constructor(2) => Number(2)
 *  + symbol 和bigint是不允许被 new 的
 *  + 所有的基本类型值都可以基于Object([value])创造他对应的引用数据类型值
 * 
 */
Function.prototype.call = function call(context, ...params) {
  // 参数异常处理
  context = context ? context : window
  context = !/^object|function$/.test(typeof context) ? Object(context) : null

  // 使用Symbol 防止属性重复
  let key = Symbol('key')
  //给context定义一个属性 改属性的值就是需要改变this的函数
  context[key] = this
  // 利用调用的this指向 执行context赋值的方法 定义this指向
  let result = context[key](...params)
  // 删除之前赋值
  delete context[key]
  return result 
}

// 闭包: 利用柯里化存储this
Function.prototype.bind = function (context, ...params) {
  let that = this
  return function proxy(...invokParams) {
   return that.call(context, ...params, ...invokParams)
  } 
}


function add(z,z2) {
  return this.x + this.y + z + z2
}


let obj = {
  x: 10,
  y: 11
}

let fn = add.bind(obj, 1)
console.log(fn(1))
console.log(add.call(obj, 3))
