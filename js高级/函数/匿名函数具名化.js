/**
 * 匿名函数具名化: 就是给一个函数设置个名字 
 *  + 此时这个名字可以在当前函数形成的私有上下文中使用, 代表当前函数本身
 *  + 此名字不能再外部上下文中使用
 *  + 在本函数中使用,他的值是不允许被修改的
 *  + 如果当前的名字被其他变量声明过, 它的值是可以改动的, 
 *    该名字就是私有变量和具名化的匿名函数没有任何关系了
 */

(function b () {
  b = 100
  console.log(b) // function b () {}
})()

(function a() {
  var a = 100
  console.log(a) // 100
})()

Promise.resolve()
  .then(() => {
    console.log(0);
    return Promise.resolve(4);
  })
  .then((res) => {
    console.log(res);
  })
Promise.resolve()
  .then(() => {
    console.log(1);
  })
  .then(() => {
    console.log(2);
  })
  .then(() => {
    console.log(3);
  })
  .then(() => {
    console.log(5);
  })
