/**
 * argumengs(实参集合[类数组])
 *  + 在形参赋值之前初始化 {0: xx, 1: xx, length: xx, callee: 函数本身}
 * 在非严格模式下 在初始化arguments 和 形参赋值后 二者会形成一个映射机制
 * 集合找那个的每一项和对应的形参变量绑定在一起了, 只会发生在代码执行之前建立
 *  + js 严格模式下没有映射机制, 并且没有arguments.callee属性
 *  + 箭头函数下没有 arguments
 */

 function b (x, y, a) {
   console.log(a) // => 3
   arguments[2] = 10
   console.log(a) // => 10
 }
 a = b(1,2,3) 
 /**
  * arguments 初始化为  {0: 1, 1: 2, 2: 3 length: 3, callee: function b() {}}
  * 建立映射机制 arguments[0] => x || arguments[1] => y || arguments[2] => a
  */
 console.log(a) // => undefined



function c(x, y, a) {
  arguments[2] = 10
  console.log(a)
}
a = b(1, 2)
/**
 * arguments 初始化为  {0: 1, 1: 2, length: 2, callee: function c() {}}
 * 建立映射机制 arguments[0] => x || arguments[1] => y
 * 
 * 由于没有传a的实参 arguments里 没有和a形成一个映射
 */
console.log(a) // => undefined