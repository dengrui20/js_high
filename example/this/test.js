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


var num = 10
var obj = {
  num: 20
}

obj.fn = (function(num){ // num = obj.num => 20
  this.num = num * 3;  // this => window   window.num = 20 * 3 => 60
  
  num ++  // num = 20 ++ => 21
  return function (n) {
    this.num += n;
    num ++;
    console.log(num)
  }
})(obj.num) // 20
var fn = obj.fn; 
fn(5) // this => window  window.num = 60 += 5  => 65  num ++ => 21 ++ => 22  log(22)
obj.fn(10) // this => obj  obj.num = 20 += 10  => 30  num ++ => 22 ++ => 23  log(23)
console.log(num, obj.num) // log(num => 65, obj.num => 30)



(function () {
  var val = 1
  var json = {
    val: 10,
    dbl: function () {
      val *= 2
    }
  }

  json.dbl()
  
  console.log(json.val + val)
})()