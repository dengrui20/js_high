/**
 * 变量提升,在当前上下文(全局/私有/块级), js代码自伤而下执行之前,浏览器会提前执行一些事情
 * (词法解析环节,词法解析发生在代码执行之前)
 * 
 * 会把当前上下文中所有带var/function关键字的进行提前的声明或定义
 *    声明declare: var a 声明
 *    定义defined: a = 10  定义赋值 
 *    var 只声明  function 声明加定义
 * 
 * 代码执行之前: 全局上下文中的变量提升
 * 
 * EC(G):  全局上下文中的变量提升
 *  不论条件是否成立,都在进行变量提升(条件中带function的在新版本浏览器中
 *   只会提前声明,不会存在提前赋值,老版本function 提前声明加定义)
 */

  var func = function AAA() {
    /**
     * 把原本做为值的函数表达式匿名函数"具名化"(虽然起了名字,
     * 但是这个名字不能再外面访问 => 也就是不会再当前上下文中创建这个名字)
     * 
     * 但函数执行,在形成的私有上下文中,会把这个具名话的名字作为私有上下文中的变量(值就是
     * 这个函数)来进行处理
     */
    AAA()
  }
  // AAA() // ReferenceError: AAA is not defined


/**
 * 变量提升 fn 函数多次赋值  => console.log(1)
 *                        => console.log(2)
 *                        => console.log(4)
 *                        => console.log(5)
 * 
 * 最后 fn => console.log(5)
 * 
 * 执行到var fn = function () { console.log(3) }
 * 后面
 * fn => console.log(3)
 */


// fn()
// function fn() { console.log(1) }
// fn()
// function fn() { console.log(2) }
// fn()
// var fn = function () { console.log(3) }
// fn()
// function fn() { console.log(4) }
// fn()
// function fn() { console.log(5) }
// fn()



/**
 * 变量提升 foo => undefined bar => function 0x001
 *  var foo = 1  全局上下文中的foo => 1
 *  function bar() {} 变量提升阶段已经做过, 直接跳过
 *  bar()
 *  块级作用域内变量提升 EC(BAR)内的 foo => undefined
 *  if(!foo)  先找到EC(BAR)中的foo 为undefined
 *  进入if  var foo = 10  EC(BAR)的foo => 10
 *  console.log(foo) => 10
 */


// var foo = 1
// function bar() {
//   if (!foo) {
//     var foo = 10
//   }
//   console.log(foo)
// }  

// bar()



/**
 * 老版本浏览器:
 *            变量提升 声明 + 赋值 foo => function
 *            代码执行 function foo () {}  // 已经做变量提升,跳过
 *            foo = 1  foo => 1
 *            console.log(foo)  => 1
 * 
 * 新版本浏览器:
 *            EC(G)变量提升: 只对当前上下文中,出现在"非函数和对象" 的大括号中的function, 只声明不定义
 *            EC(G)变量提升 foo => undefined
 *            代码执行过程中 {} 如果大括号中出现了 let/const/function等关键字
 *                则会形成一个全新的块级私有上下文EC(BLOCK) 
 *            EC(BLOCK) 变量提升 foo => function () {}
 *            EC(BLOCK)
 *                代码执行 function foo () {}  // 私有上下文中这一步已经做过变量提升 所以这一步不会执行
 *     
 * ************* 重点 ***************
 * 
 *    由于同一处代码的foo 在EC(G)和EC(BLOCK)  中都做过变量提升 
 *    所以这一和EC(G)全局上下文也有关系 把当前这一行代码之前对foo的操作都同步给全局一份
 * 
 * ****************** 结束 **********
 *    但是这行代码执行完之后 对foo的操作都认为是改自己私有的, 和全局没关系
 *              EC(BLOCK):  foo = 1  foo => 1
 *            EC(G) console.log(foo)  => function
 */     
// {
//   function foo () {}
//   foo = 1
// }
// console.log(foo)




/**
 * EC(G) 变量提升 声明 a => 声明了2次  EC(G) 下的a   EC(BLOCK) a function  由于新版本块级作用域的问题 function 只声明 不定义
 * 进入if 后 私有上下文中内 变量提升  函数提升赋值 a => function() {}
 * console.log(a, window.a)  EC(BLOCK) a => 1  EC(G) window.a => 0
 * 执行到 a = 1    EC(BLOCK) a => 1  EC(G) window.a => 0
 *
 * 执行到 function a() {} 由于在EC(G) 和 EC(BLOCK)  都做过变量提升,
 * 这一步操作和EC(G)下的a也有关系，
 * 把这一行之前对a的操作全部同步到EC(G)下执行一遍,后面对a的操作都认为是私有的
 *
 * console.log(a, window.a) EC(BLOCK)的a为1 ，EC(G)下的为1
 * 执行到 a = 21 私有上下文下的  EC(BLOCK) a => 21 (赋值)
 * console.log(21)
 *
 * 全局上下文中的a  console.log(21)
 */



// var a = 0
// if (true) {
//   console.log(a, window.a)
//   a = 1;
//   console.log(a, window.a)
//   function a () {}
//   console.log(a, window.a)
//   a = 21
//   console.log(a, window.a)
// }
// console.log(a)



/**
 * EC(G) 变量提升 x => undefined  func2() => functin  [[ scope ]]: EC(G)
 * func2(5) => 执行
 * 形成EC(FUNC2) EC(BLOCK)
 *    + 形参赋值 x => 5 , y => function  作用域链< EC(Y), EC(FUNC2) >
 * 形参赋值完成下面的操作进入EC(BLOCK)  处理
 * EC(BLOCK) => 作用域链 < EC(BLOCK), EC(FUNC2)>
 * 将EC(FUNC2)的形参x 和 EC(BLOCK)中的x 名字一样 赋值给 EC(BLOCK) x
 * EC(BLOCK)中  x = 5
 * 
 * 执行到 var x = 3   EC(BLOCK)中  x = 3
 * 
 * 执行到 y()
*  EC(FUNC2) 没有 y 往上级上下文中查找  EC(FUNC2) y 找到然后执行 形成 EC(Y)
 * EC(Y) 执行 x = 2   EC(Y) 没有x  往上级上下文中查找 EC(FUNC2)  发现x 并且赋值  EC(FUNC2) => x = 2
 * y() 执行完成之后出栈
*  console.log(x) EC(BLOCK) 下的x = 3
 * 
 * ***************** 重点 ********************
 * 如果符合以下条件 
 *    + 1. 形参赋值默认值
 *    + 2. 函数体中声明过变量（ let/const/var ）
 *      ++++  特殊: 函数体中的function声明的变量必须和形参的某一个变量名字一直，才会有下面的机制, 其他正常变量 名字不用和形参的名字一直
 *       如 function(a) { let b = 11 } 执行会形成2个上下文
 *          function(a) { function b() {} } 执行会形成1个上下文
 *          function(a) { function a() {} } 执行会形成2个上下文
 *    + 机会触发一个新的机制: 函数形成不仅形成了一个EC(FN), 还形成了一个块级上下文EC(BLOCK)   EC(BLOCK)的上级上下文是EC(FN)
 *    + 如果块级私有上下文中声明的变量, 也出现在函数的形参变量中, 则也会默认的把私有上下文中的形参变量
 *    复制给块级上下文中同名的变量一份
 *    + 私有上下文EC(FN)形参赋值成功后,所有的代码执行流程都是在块级上下文EC(BLOCK)中处理的
 *    + 形成EC(BLOCK) 中不能用let/const声明和形参相同的变量,否则重复声明会报语法错误
 * 
 * ***************** 结束 ********************
 */

// var x = 1
// function func2 ( x, y = function aa() { x = 2 } ) {
//   var x = 3
//   y();
//   console.log(x)
// }

// func2(5)
// console.log(x)
