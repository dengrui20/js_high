## js高阶编程技巧
  **本质** `: 基于'闭包'的机制完成的`

---
#### 应用
**1. 循环事件绑定或者循环操作中对于闭包的应用**
```javascript
for(var i = 0; i < 3; i++>) {
  setTimeout(() => {
    cosole.log(i)
  }, (i+1) * 1000)
}
// 3  3  3


// 每一个匿名函数执行的时候都会创建一个箭头函数堆, 并且会赋值给window.settimeout, 
// 等价于当前上下文中的某些内容被上下文以外的东西占用了,形成的上细纹不会被释放(i也不会被释放)
for(var i = 0; i < 3; i++) {
  (function (i) {
    setTimeout(() => {
      console.log(i)
    }, (i+1) * 1000)
  })(i)
}

// 基于let的循环
// 先创建一个父级的私有上下文, 控制循环
// 每轮循环会产生一个私有的块级上下文 都有自己的私有变量i

for(let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i)
  }, (i+1) * 1000)
}


// 这种写法不会形成块级上文 也不会形成闭包 性能会好很多
let i = 0;
for( ;i < 3; i++) {
  setTimeout(() => {
    console.log(i)
  }, (i+1) * 1000)
}

// 0 1 2
```

**2. 基于'闭包'实现早起的'模块化思想'**
    * 单例设计模式
    * AMD -> require.js
    * CMD -> sea.js
    * commonJs -> node
    * es6Module
    * ...

```javascript
let utils = (function(window) {
  const format = function() {}
  const trasnform = function() {}

  return {
    format,
    trasnform
  }
})(window)
```
    
**3. 惰性函数**

```javascript
function get_css(ele, attr) {
  // 每次执行都要做兼容判断 
  if ('getComputedStyle' in window) {
    return window.getComputedStyle(ele)[attr]
  }
  return ele.currentStyle[attr]
}

function get_css_lazy(ele, attr) {
  // 重写函数 避免每次都做兼容判断
  if ('getComputedStyle' in window) {
    get_css_lazy = function (ele, attr) {
      return window.getComputedStyle(ele)[attr]
    } 
  } else {
    get_css_lazy = function (ele, attr) {
      return ele.currentStyle(ele)[attr]
    } 
  }
  return get_css_lazy(ele, attr) // 第一次执行的时候要有返回结果
}

var width = get_css(document.body, 'width')
var width2 = get_css_lazy(document.body, 'width')
```


**4. 柯里化函数(预处理思想)**
 * 执行函数形成一个闭包, 把一些信息(私有变量和值)存储起来
 * 以后其下级上下文中如果需要用到这些值,直接基于作用域链查找机制,拿来直接用即可

```javascript
function fn() {
  let outerArgs = Array.from(arguments)

  return anonymous () {
    let innerArgs = Array.from(arguments)
    let params = outerArgs.concat(innerArgs)
    let results = params.reduce((prve, current) => {
      return prve += current
    }, 0)

    return results
  }
}

// 简写
const fn2 = (...outerArgs) => (...innerArgs) => outerArgs.concat(innerArgs).reduce((prve, current) =>  prve += current, 0)

let res = fn(1, 2)(3)
console.log(res)
```


**4. compose组合函数**
* 在函数式编程中有一个概念就是函数组合,实际上就是把处理数据的函数像管道一样连接起来,然后让数据穿过管道得到最终的结果

```javascript
const add = x => x + 1
const mul = x => x * 3
const reduce = x => x -1
console.log(reduce(add(mul(3))))
```

通过compose函数处理

```javascript
const add = x => x + 1
const mul = x => x * 3
const reduce = x => x - 2

const compose = function (...rest) {
  if (rest.length === 1) rest[0]
  if (rest.length === 0) x => x
  return (num) => {
    return rest.reduce((prve, current) => {
      return current(prve)
    }, num)
  } 
}

// 按照传入的函数 依次处理
const fn = compose(add, mul, reduce)

fn(3) // 4
```
