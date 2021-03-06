
// let a = 0
//     b = 0
// function fn(a) {
//   fn = function (b) {
//     console.log(a + b ++)
//   }
//   console.log(a ++)
// }

// fn(1)
// fn(2)

// ======> 执行流程 (忽略变量提升)
/* 创建一个全局上下文EC(G)
 * 创建一个全局变量对象VO(G)  
 * 在栈内存里创建一个值为0
 * 声明一个全局变量a 关联到 0
 * 声明一个全局变量b 关联到 0
 * 
 * 创建一个堆内存(函数堆)0x000
 * 在堆里面存储fn的代码字符串
 * 函数的形参为a
 * fn声明一个作用域[[scope]]: EC(G)
 * 将堆函数地址 存放到全局上下文 
 * 声明一个变量 fn -> 0x000  指向函数堆的地址
 * 
 * fn(1) 进栈执行的时候 创建一个私有上下文EC(FN1)
 * 创建一个私有变量对象AO(FN1)
 * 创建一个作用域链 <EC(FN1),  ECG>
 * 形参赋值 a => 1
 * 执行代码块
 * 创建一个函数对 0x001
 * 函数形参 b
 * 在堆里(0x001)面存储里匿名的代码字符串
 * 执行代码块 fn = function() {}
 * fn => 0x001 (沿着作用域链找fn -> <EC(FN1), ECG> =>  EC(FN1) 没有fn 往上找 => ECG 找到了fn 重新赋值 0x001)
 * 执行代码块 console.log(a ++)
 * 先log => 1  再 a 自增 a => 2
 * 当前上下文EC(FN1)上下文中的0x001被全局EC(G)的fn给占用了 所以现在EC(FN1)上下文不会被释放  形参a 也不会被销毁 -> 闭包
 * 因为函数fn被重新指向了0x001 所以堆内存0x000 会被释放掉
 * 
 * fn(2) 进栈执行 创建一个私有上下文EC(FN2)
 * 创建一个私有变量对象AO(FN2)
 * 创建一个作用域链 <EC(FN2), EC(FN1),  ECG>
 * 形参复制 b => 2
 * 代码块执行
 * console.log(a + b ++)
 * b 沿着上下文找 在EC(FN2) 找到 b => 2 
 * a 沿着上下文找 在EC(FN1) 找到 a => 2
 * 先执行 console.log(a + b)
 * log => 4
 * b ++ 
 * b => 3
 * 
 * EC(FN2) 上下文没有被其他上下文占用 所以会被释放
 */


 /**
  * 闭包: 函数运行的一种机制(不是某种代码形式)
  *     函数执行会形成一个私有上下文, 如果上下文中的某些内容被上下文以外的一些事物(如变量/事件绑定等)
  * 所占用,则当前上下文不能被出栈释放, 「 浏览器的垃圾回收机制(GC)所决定 」
  *     保护: 保护私有上下文中的私有变量和外界互不影响
  *     保存: 上下文不被释放,那么上下文中的"私有变量"和"值"都会被保存起来,可以供其上下文中使用
  * 弊端: 如果大量使用闭包,会导致栈内存太大,性能受到影响, 某些代码会导致栈溢出或内存泄露
  */


  // var a = 9;
  // function fn() {
  //   a = 0;
  //   return function (b) {
  //     return b + a ++
  //   }
  // }

  // var f = fn(); 
  // // ===> a => 0
  // /**
  //  * 
  //  * f => function (b) {
  //       return b + a ++
  //   }
  //  * 
  // */
  // console.log(f(5)) // => log =>5  a => 6 
  // console.log(fn()(5)); // a => 0 || 5 + 0 ====> log => 5 || a => 1
  // console.log(f(5)) // log => 6 || a => 2
  // console.log(a) // log => 2


//   var x = 5, y = 6;
//   function func() {
//     x += y
//     func = function (y) {
//       console.log(y + (--x));
//     }
//     console.log(x, y)
//   }

// func(4) // EC(FN1) 全局 x += 6 => 11 全局 y => 6 || func = new function || log(x => 11, y => 6)
// func(3) // EC(FN2) 私有y => 3, 全局 x => 11 || log(3 + (--11) => 13)  x => 10
// console.log(x, y) // log(x => 10, y => 6)






 
let age = 11
function fun () {
  let person = { age: ++age  }
  return {
    person
  }
}
let b = fun()

console.log(b.person)
