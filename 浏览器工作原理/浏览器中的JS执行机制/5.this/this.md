## this
#### 全局执行上下文中的 this
全局执行上下文中的 this 是指向window 对象的。这也是 this 和作用域链的唯一交点，作用域链的最底端包含了 window对象，全局执行上下文中的 this 也是指向 window 对象

#### 函数执行上下文中的 this

在默认情况下调用一个函数，其执行上下文中的 this 也是指向 window 对象的

可通过以下方法修改this指向
 1. 通过函数的 call 方法设置
 ```js
  let obj = {name: '小明'}
  function getName() {
    console.log(this.name)
  }
  console.log(getName.call(obj)) // 小明
 ```
 2. 通过对象调用方法设置
  ```js
    let obj = {name: '小明'}
    function getName() {
      console.log(this.name)
    }
    obj.getName = getName
    console.log(obj.getName()) // 小明
  ```
  3. 通过构造函数中设置
  ```js
  function CreateObj(){
    this.name = "小明"
  }
  var myObj = new CreateObj()
  console.log(myObj) // { name: '小明' }
  ```

#### this 的设计缺陷以及应对方案
  1. 嵌套函数中的 this 不会从外层函数中继承
  ```js
    let obj = {
      name: '小明'
      getName() {
        console.log(this) // => obj
        function getThis() {
          console.log(this) // window
        }
        getThis()
      }
    }

    // 可通过变量 利用作用域机制 let that = this
    // 或者通过箭头函数 
    let obj = {
      name: '小明'
      getName() {
        console.log(this) // => obj
        let that = this
        function getThis() {
          console.log(that) // => obj
        }
        getThis()
      }
    }

  ```
