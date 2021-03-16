## 块级作用域
#### 作用域scope

作用域是指在程序中定义变量的区域，该位置决定了变量的生命周期。通俗地理解，作用域就是变量与函数的可访问范围，即作用域控制着变量和函数的可见性和生命周期。
  + **全局作用域**
    全局作用域中的对象在代码中的任何地方都能访问，其生命周期伴随着页面的生命周期
  
  + **函数作用域**
    函数作用域就是在函数内部定义的变量或者函数，并且定义的变量或者函数只能在函数内部被访问。函数执行结束之后，函数内部定义的变量会被销毁
  + **块级作用域**
  块级作用域就是使用一对大括号包裹的一段代码,比如函数、判断语句、循环语句，甚至单独的一个{  }都可以被看作是一个块级作用域
  ```js
  //if 块
  if(1){}

  //while 块
  while(1){}

  // 函数块
  function foo(){}

  //for 循环块
  for(let i = 0; i<100; i++){}

  // 单独一个块
  {}
  ```


  #### 变量提升所带来的问题
  1. 变量容易在不被察觉的情况下被覆盖掉
  ```js
  var myname = "小明"
  function showName(){
    // 函数内部存在内部提升
    console.log(myname); // => undefined
    if(0){
      var myname = "小红"
    }
    console.log(myname) // undefined
  }
  showName()

  // ===============

  var myname = "小明"
  function showName(){
    console.log(myname); // => 小明
    /*if(0){
      var myname = "小红"
    }*/
    console.log(myname) // => 小明
  }
  showName()
  ```


  2. 本应销毁的变量没有被销毁
  ```js
  
  function foo(){
    for (var i = 0; i < 7; i++) {

    }
    // for循环后变量i没有被销毁
    console.log(i)
  }
  foo()

  x ;
  let x = 1;
  x;
  ```

  #### JavaScript 是如何支持块级作用域的
  **变量环境**是指：对应环境中的变量(和VO「变量对象」类似,)
  **词法环境**是指：具有词法上下文关系的词法内容。比如let，const变量是具有一定上下文关系的。比如this也会在词法环境中

  > 此处存疑 =>变量环境和变量对象是否是同一个概念?????????
  ```js
  
    /**
     * 函数只会在第一次执行的时候被编译，
       所以编译时变量环境和词法环境最顶层数据已经确定了
     * 创建foo函数执行上下文 EC(foo)
     * 变量提升阶段
     * var 声明存储在 函数变量环境VE(foo){a:undefined,  c: unedfined}
     * let 编译阶段 存储在函数执行上下文的词法环境中(词法环境属于栈结构)
     * LE(foo) => { b: undefined }
     * 现在在函数执行上下文中 
        EC(foo) => {
          变量环境VE(foo) => {a:undefined,  c: unedfined}
          词法环境LE(foo) => [ { b: undefined } ] 还未初始化 这时候使用会报错
        }
     *   var a = 1  let b = 2 执行完成后

        EC(foo) => {
          变量环境VE(foo) => {a: 1,  c: unedfined}
          词法环境LE(foo) => [{ b: 2 }]
        }
     * 执行到代码块里面的时候 {let b = 3 .... }
     * 这时候代码块的作用域链[scope]<block>
     * EC(foo) => {
          变量环境VE(foo) => {a: 1,  c: unedfined}
          词法环境LE(foo) => [ 
            { b: 2 },
             创建变量 代码块内部的 let/const 变量 放入栈中
            { b: undefined, d: undefined }
          ]
        }
     * let b = 3; var c = 4; let d = 5 执行完成之后
     * EC(foo) => {
        变量环境VE(foo) => {a:1,  c: 4}
        词法环境LE(foo) => [ 
          { b: 2 }, 
          { b: 3, d: 5 } 代码块内部的 let 变量
        ]
      }
     * 代码块内部的  console.log(a); console.log(b)
     * 现在变量查找顺序是 先沿着词法环境 
     * 从栈 自顶向下查找, 如果没找到就在变量环境里查找 
     * log a => 1     log b => 3 
     * 代码块{...} 执行之后 代码块在词法环境中的变量就会被弹出
     *  EC(foo) => {
          变量环境VE(foo) => {a:1,  c: 4}
          词法环境LE(foo) => [ 
            { b: 2 }, 
            ---------------> { b: 3, d: 5 } => 代码块执行完成弹出 删除
          ]
        }
     * console.log(b); console.log(c); console.log(d);
     * log b => 2   log c => 4    log d => ReferenceError: d is not defined
     */

    // 个人觉得 也可以理解为在块级作用域下 let/const/function
    // 创建提升后都会打包放入词法环境的栈中, 单独占一块 
    // 这个包里面的变量就是我们平时理解的块级作用域里面的变量
    // 在这个块级作用域下查找的变量 会优先在这个包下面查找对应变量
    // 如果这个包里面不存在就会沿着词法环境栈向下查找
    // 由于词法环境是栈型结构, 所以下面的(包)一定是上级作用域内的变量
  function foo(){
    var a = 1
    let b = 2
    {
      let b = 3
      var c = 4
      let d = 5
      console.log(a)
      console.log(b)
    }
    console.log(b)
    console.log(c)
    console.log(d)
  }
  foo()

  ```
  补充: 
  + var的创建和初始化被提升，赋值不会被提升。
  + let的创建被提升，初始化和赋值不会被提升。
  + function的创建、初始化和赋值均会被提升。
  ```js
  let myname = 'aa'
    {
      /**
       * 
        EC(G) => {
            词法环境LE(foo) => [ 
              { myname: 'aa' }, 
              { myname: undefined } 
          ]
        }
        词法环境中的提升只是创建提升, 并不会初始化变量
        这时候在块级作用域内获取myname 会报错


        

      */
      console.log(myname) // Uncaught ReferenceError: Cannot access 'myname' before initialization
      let myname = 'bb'
    }
  ```