/**
 * 事件绑定 
 *  给当前元素的绑定事件,当事件触发,方法执行,方法中的this指向的是当前元素本身
 */

//  window.onload = function () {
//    document.body.addEventListener('click', function () {
//      console.log(this)
//    })
//  }


//  /**
//   * 普通函数
//   * 函数执行时候被其他对象调用 => obj.fn()
//   * 如果没有就是指向window,严格模式下是undefined
//   */

//   function normalFn () {
//     console.log(this)
//   }

//   let obj = {
//     fn: normalFn  
//   }

//   normalFn() // => window/undefined
//   obj.fn(); // => obj
//   (obj.fn)(); // => this -> obj

//   // 括号表达式
//   (10, obj.fn)() // => this -> window/undefined

// /**
// * 匿名函数
// * 如果没有经过特殊处理, 则this一般都是指向window/undefined
// */

//   function cbFn(cb) {
//     cb() // => 执行时没有被其他方式调用
//   }


//   cbFn(obj.fn) // => window/undefined
