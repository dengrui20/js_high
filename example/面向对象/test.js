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