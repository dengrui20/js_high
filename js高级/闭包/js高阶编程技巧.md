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

  return function anonymous () {
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


**5. compose组合函数**
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

**6. 函数的防抖** 
* 对于频繁触发某个操作,最后只触发一次

```javascript
/**
 * @description: 
 * @param {Function} fn 触发的函数
 * @param {Function} wait 触发的频率
 * @param {Function} immediate 是识别第一次 还是最后一次操作
 * @return {Function} 返回一个可被调用的函数
 */

function debounce(fn, wait = 300, immediate = false) {
  let timer = null

  return function (...arg) {
    // 清除定时器
    let now = immediate && !timer
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      // wait 等待中 不会触发第二次
      !immediate ? fn && fn().call(this, ...arg) : null
    }, wait)
    
    // 如果立即执行
    !now ? fn.call(this, ...params) : null
  }
}
submit.onclick = debounce(handle, 200, true)
```

**7. 函数的节流** 
* 在一段频繁操作中,可以触发多次,但是触发频率由自己决定


```javascript
function throttle(fn, wait = 300) {
  let timer = null;
  let previous = 0
  return function (...params) {
    let now = new Date();
    let remain = wait - (now - previous) // 计算时间差

    if(remain <= 0) {
      // 超过间隔时间
      clerTimeout(timer)
      previous = now
      fn.call(this, ...params)
    } else if(!timer) {
      // 小于间隔 延迟触发
      timer = setTimeout(() => {
        timer = null
        previous = new Date()
        fn.call(this, ...params)
      }, remain)
    }
  }
}

function handle () {
  console.log('scroll')
}
// 每一次滚动过程中,浏览器有最快反应时间(5-6ms  13-17ms),
// 只要反应过来就会触发执行一次函数(此时触发频率为5ms左右)
window.onscroll = handle


window.onscroll = throttle(handle)  // 我们控制频率为300ms触发一次

```

