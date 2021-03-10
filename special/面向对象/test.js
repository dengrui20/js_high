// 重写new

function Animail (name) {
  this.name = name
}

Animail.prototype.eat = function(food) {
  console.log(`eat ${food}`)
}

Animail.prototype.move = function (speed) {
  console.log(`move ${speed}`)
}

function _new(Ctor, ...params) {
  let obj = Object.create(Animail.prototype)
  let result = Ctor.apply(obj, params)
  let resultType = typeof result
  if ('objectfunction'.includes(resultType)) {
    return result
  }
  return obj
}

let miniAnimail = _new(Animail,'miniAnimail')

console.log(miniAnimail.name)
miniAnimail.move('水果')
miniAnimail.eat('100m')


function Fn() {
  let a = 1;
  this.a = a
}

Fn.prototype.say = function () {
  this.a = 2
}

// 原型重定向
// 执行的过程
// let ob => => 0x002 j = new Fn
// obj.__proto__  = Fn.prototype => 0x001
// Fn.prototype = obj => 0x002;
Fn.prototype = new Fn;


let f1 = new Fn;

Fn.prototype.b = function() {
  this.a = 3
}

console.log(f1.a)  // 1
console.log(f1.prototype) // undefined
console.log(f1.b) // function
console.log(f1.hasOwnProperty('b')) // false
console.log('b' in f1)  // true
console.log(f1.constructor === Fn) // true


//============================
/**
 * 1.变量提升 Foo => function Foo 
 * getName => window.getName => undefined
 * getName => window.getName => function log(5) 
 * 
 * 执行 var getName = function log(4) getName => winow.getName => function log(4)
 * 
 * 执行 Foo.getName()  全局Foo.getName => function log(2)
 * 执行getName() =====> log(4)
 * 执行Foo().getName()    Foo() 返回this => window  window.getName() =====> log(1)
 * 执行 getName()   =====> log(1)
 * 执行 new Foo.getName() 
 * . 的优先级 大于new  所以先获取getName 在 new
 * 类似于 new (Foo.getName)()
 * new Foo 优先级 是19
 * Foo.getName优先级 是20
 * 
 * 执行new Foo().getName()   ===> log 3
 * new Foo() 优先级是20      ** new Foo 优先级是19 **
 * .getName()优先级是19
 * 先执行 new Foo() 在执行.getName()
 * 
 * 
 * 执行 new new Foo().getName()  // ===> log 3
 * 先 instance = new Foo()
 * 再 new (instance.getName)()
 */
function Foo() {
  getName = function () {
    console.log(1)
  }
  return this
}

Foo.getName = function () {
  console.log(2)
}

Foo.prototype.getName = function () {
  console.log(3)
}

var getName = function () {
  console.log(4)
}

function getName() {
  console.log(5)
}

Foo.getName()
getName()
Foo().getName()
getName()
new Foo.getName()
new Foo().getName()
new new Foo().getName()


//=========================
let obj = {
  2: 3,
  3: 4,
  length: 2,
  push: Array.prototype.push
}

obj.push(1)
obj.push(2)

console.log(obj) // { '2': 1, '3': 2, length: 4, push: [Function: push] }

// push的实现
// Array.prototype.push = function(value) {
//   this[this.length] = value 
//   this.length ++
// }

obj.forEach(item => {
  console.log(item)
}) // error
// obj因为不是数组 所以不会调用数组原型上的方法
/**
 * 解决方式一: 改变this
 * Array.prototype.forEach.call(obj,(item) => {
 *    console.log(item)
 * })
 * 
 * 解决方式二: 改变原型指向
 * obj.__proto__ = Array.prototype
 * obj.forEach(item => {
 *    console.log(item)
 * })
 * 
 * 解决方法三: 把需要用到的方法作为obj的私有属性
 * obj.forEach = Array.prototype.forEach
 * 
*/

//==============================

// var a = ?;
if(a == 1 && a == 2 && a == 3) {
  console.log("ok")
} 

/**
 *  解决方式一: 利用浏览器的隐式转换 重写处理方法 实现
 *  引用对象转换成数字规则:
 *  1. 先查找对象的Symbol.toPrimitive 属性 执行
 *  2. valueOf方法获取原始值(基本类型)
 *  3. toString & Number
 */

 // 可任意重写一种方法
 var a = {
   i: 0,
   [Symbol.toPrimitive]() {
      return ++ this.i
   }
 }

 //**** 重写valueOf *****/
 var a = [1,2,3]
 a.toString = a.unshift


 /**
  * 解决方式二: 
  * 利用Object.definedProperty 做数据劫持
  * 
 */

 var i = 0
 Object.defineProperty(window, 'a', {
   get() {
    return ++i
   }
 })



 //=====================================

var name = "小明"
function A (x, y) {
  var res = x + y
  console.log(res, this.name)
}
function B (x, y) {
  var res = x - y;
  console.log(res, this.name)
}
B.call(A, 40, 30)  // 10 A

B.call.call.call(A, 20, 10) // NaN undefined
// 步骤 let fn = B.call.call     fn.call(A, 20, 10) 
//  执行
//  1. fn(20, 10) |  this => A   fn => A[call](20, 10)
//  2. A[call](20, 10) | this => 20    20[A](10)


// Function.prototype 是个匿名空函数

Function.prototype.call(A, 60, 50) // 什么都不输出
/***
 * let fn = Function.prototype
 * fn.call(A, 60, 50)
 * A[fn](60, 50)
 * fn 是个空函数 什么也不会log
 */

Function.call.call.call(A, 80, 70) // NaN undefined
// 步骤 let fn = Function.call.call     fn.call(A, 80, 70)
//  执行
//  1. fn(80, 70) |  this => A   fn => A[call](80, 70)
//  2. A[call](80, 10) | this => 70    80[A](70)
