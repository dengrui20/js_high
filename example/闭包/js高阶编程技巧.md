## js高阶编程技巧
  **本质** `: 基于'闭包'的机制完成的`

---
#### 应用
1. 循环事件绑定或者循环操作中对于闭包的应用
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

2. 基于'闭包'实现早起的'模块化思想'
    * 单例设计模式
    * AMD -> require.js
    * CMD -> sea.js
    * commonJs -> node
    * es6Module
    * ...
    