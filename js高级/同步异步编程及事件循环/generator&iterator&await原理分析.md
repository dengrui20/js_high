## generator&iterator&await原理分析
#### 遍历器(Iterator)
  Iterator是一种机制(接口),为各种不同的数据接口提供统一的访问机制, 任何数据结构只要部署Iterator接口, 就可以完成遍历操作, 一次处理该数据结构的所有成员
  + 拥有next方法用于一次遍历数据结构的成员
  + 每次遍历返回的结果是一个对象 { done: false, value: xxx}
    + done: 记录是否遍历完成
    + value: 当前遍历的结果
  + 拥有Symbol.iterator属性的数据结构(值),被称为可遍历的, 可以基于for of循环处理
    + 数组
    + 部分类数组: arguments/NodeList/HTMLCollection...
    + String
    + Set
    + Map
    + generator object
    `对象默认不具备Symbol.iterator, 属于不可遍历的数据结构`
  ```javascript

  let arr = [1, 2, 3]

  // 重写 Symbol.iterator 接口
  // 遍历偶数项
  arr[Symbol.iterator] = function () {
    // 必须返回一个符合Iterator规范的对象
    // 具备next方法
    let index = 0, that = this
    return {
      next() {
        const result = {
          done: index > that.length - 1,
          value: that[index]
        }
        index += 2
        return result
      }
    }
  }

  //for of 默认会调用arr上的[Symbol.interator] 方法

  for (let item of arr) {
    console.log(item)
  }

  console.log([...arr]) // 拓展运算符也是会优先 调用Symbol.iterator 接口

  let obj = {0: 0, 1: 1, 2: 2 }
  for(let item of obj) {
    console.log(item) // Uncaught TypeError: obj is not iterable
  }
  // ================
  // 让类数组的对象具备可遍历性
  let obj = {
    0: 0,
    1: 1,
    2: 2,
    length: 3,
    [Symbol.iterator]: Array[Symbol.iterator]
  }
  for(let item of obj) {
    console.log(item) // 1 2 3
  }
  // 让普通对象具备可遍历性
  Object.prototype[Symbol.iterator] = function () {
     let that = this,index = 0
      let keys = [
        ...Object.keys(this),
        ...Object.getOwnPropertySymbols(this)
      ]
      return {
        next() {
          return {
            done: index > keys.length - 1,
            value: that[keys[index++]]
          }
        }
      }
  }
  let obj = {
    name: '小明',
    age: 11,
    [Symbol('test')]: 1000
  }

  for(let item of obj) {
    console.log(item) // 小明 11 1000

  }

  ```

#### 生成器对象(generator object)
生成器对象是由一个generator function返回的实例, 并且他复核可迭代协议和迭代器协议
该对象具备以下特性
 + next: 依次遍历对应的值
 + return: 结束遍历并返回return执行的值
 + throw
 该对象拥有 Symbol(Symbol.iterator) 这个属性值, 说明获取的结果是符合iterator规范的

 *语法一*
```javascript
function* func() {
  console.log('1')
  yield 1;
   console.log('2')
  yield 2;
   console.log('3')
  yield 3;
   console.log('4')
}
func.prototype.AA = '10'

// 返回值为func的实例
let iterator = func() // log => 1
iterator.next()
// return => { done: false, value: 1 } log => 2

iterator.next()
// return => { done: false, value: 2 } log => 3

iterator.next()
// return => { done: false, value: 31} log => 4

iterator.next()
// return => { done: true, value: undefined } => 这个value就是函数return的值 如果没有返回就是undefined
// func 无法new
new func // Uncaught TypeError: func is not a constructor
console.log(iterator instanceof func) // true
```
*语法二*
```javascript
function* func () {
  let x = yield 1 
  // x 为 触发yield 1执行时候 之后 下一次next() 里面传的值

  console.log(x)
  let y = yield 2
  console.log(y)
}
let iterator = func()
iterator.next()
iterator.next(5) // x => 5
iterator.next(11) // y => 11
```

*语法三*
```javascript
  function* func1() {
    yield 1
    yield 2
  }
  function* func2() {
    yield 3
    yield func1()
    yield 4
  }

  let iterator = func2()
console.log(iterator.next()) // return { done: false, value: 3 }
console.log(iterator.next()) // return { done: false, value: func1 }
console.log(iterator.next()) // return { done: false, value: 4 }
console.log(iterator.next()) // return { done: true, value: undefined }
console.log(iterator.next()) // return { done: true, value: undefined }

// =================

  function* func1() {
    yield 1
    yield 2
  }
  function* func2() {
    yield 3
    // 如果yield后面加了* 并且后面是一个生成器对象
    // 每次next()会先把生成器对象里面的遍历完才会再遍历外面
    yield* func1()
    yield 4
  }

  let iterator = func2()
console.log(iterator.next()) // return { done: false, value: 3 }
console.log(iterator.next()) // return { done: false, value: 1 }
console.log(iterator.next()) // return { done: false, value: 2 }
console.log(iterator.next()) // return { done: false, value: 4 }
console.log(iterator.next()) // return { done: true, value: undefined }
```
*语法四*
```javascript
  function* func() {
    console.log(this) // => window 
    this.name = "小明" // 返回的实例没有这个属性
    yield 1
  }
  func.prototype.age = 18
  let iterator =  func()
  iterator.next()
  console.log(iterator.name) // undefined
  console.log(iterator.age) // 18
```
---
案例: 多个请求实现串行

1. 方法一: 通过调用then链 实现串行
```javascript

// 模拟一个异步请求
const func = x => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(++x)
    }, 1000)
  })
}

// 通过调用then链 实现串行
func(0).then((data) => {
  console.log(data)
  return func(data)
}).then((data) => {
  console.log(data)
  return func(data)
}).then((data) => {
  console.log(data)
})
```

2. 方法二: generator 函数实现

```javascript
// 模拟一个异步请求
const func = x => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(++x)
    }, 1000)
  })
}

function* generatorFn(x) {
  let r = yield func(x)
  console.log(r)
   r = yield func(r)
  console.log(r)
   r = yield func(r)
  console.log(r)
}

let iterator = generatorFn(0)
let r = iterator.next()
r.value.then((result) => {
  r = iterator.next(result)
  r.value.then(result => {
    r = iterator.next(result)
    r.value.then(result => {
      r = iterator.next(result)
    })
  })
})
```

3. 方法三: async/await

```javascript
const func = x => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(++x)
    }, 1000)
  })
}

async function asyncFn() {
  let r = await func(0)
  console.log(r)
  r = await func(r)
  console.log(r)
  r = await func(r)
  console.log(r)
}
asyncFn()
```
##### 用generator function 和 Promise 实现 async/await

```javascript
const func = x => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(++x)
    }, 1000)
  })
}

function AsyncFn(generatorFunction, ...parmars) {
  let iterator = generatorFunction(...parmars)
  const next = x => {
    let { value, done } = iterator.next(x)
    if (done) return 
    value.then((x) => {
      return next(x)
    })
  }
  next()
}

function* generatorFn(x) {
  let r = yield func(x)
  console.log(r)
   r = yield func(r)
  console.log(r)
   r = yield func(r)
  console.log(r)
}
AsyncFn(generatorFn, 0)
```
`async/await 就是 generator function/Promise 的语法糖`
 