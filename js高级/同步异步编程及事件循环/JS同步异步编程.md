## JS同步异步编程
#### 进程 & 线程
一个进程可能包含多个线程
  ***进程***: 程序 (浏览器打开一个页面,就会开辟一个进程)
  ***线程***: 处理任务(一个线程同时只能处理一个任务)

---
#### 浏览器是多线程
  + ***http网络线程***: 用于资源文件的加载
  + ***GUI渲染线程***: 用于页面自上而下渲染, 最后绘制出页面
  + ***JS渲染线程***: 用于渲染我们的JS代码
  ...

####  JS是单线程的
+ 浏览器只会开辟一个主线程用来渲染JS代码, 所以JS的本质都是同步的(当前任务处理完成后才能处理下一个,不能同时处理多个)
+ 所有的代码最后都是在栈内存中执行的(会产生不同的执行上下文EC),所有的代码执行都是浏览器开辟的"JS渲染线程"自上而下, 依次解析代码,并且执行代码的该线程也被称为「JS主线程」


```
JS是存在「异步」编程代码的, 
但是此处的异步边编程也不是让其同事处理多件任务,
只不过是基于浏览器的多线程性,
借助Event Loop事件循环机制,构建出来的异步效果
```

#### JS异步编程代码
**宏任务(macroTask)**
+ 定时器: 设置定时器是同步的, 而间隔interval这么长的时间后触发绑定的方法执行
 
```javascript
// 定时器的返回值是一个数字, 
// 代表当前系统中的第几个定时器,
// 清除的时候也是基于这个数字清除
let n = 0;

// 创建一个异步任务 放到事件队列里(Event Queue)里, 任务放置完，
// 放置完成后会单独开辟一个事件监听线程,监听定时器是否到达指定时间
// 此时浏览器已经开辟2个线程(JS主线程和监听线程)
// 异步任务放置完成后, 同步代码继续执行
let timer = setTimeout(() => {
  n ++
  console.log(n)
},1000)

console.log(n)

// 此时同步任务被执行完成
// 同步代码执行完成之后 主线程空闲
// 1000ms 之后 监听线程会通知主线程发现存在等待任务并且到达事件
// 将该任务放到主线程中执行
/**
 * ECStack 执行环境栈
 * 所有的代码最后都是在栈内存中执行的(会产生不同的执行上下文EC)
 * 所有的代码执行都是浏览器开辟的"JS渲染线程"自上而下
 * 依次解析代码,并且执行代码的该线程也被称为「主线程」
 */
```

+ 事件绑定
  监听事件，事件触发执行绑定的方法
+ AJAX/FETCH等网络请求 


**微任务任务(microTask)**
+ Promise: then/resolve/reject通知注册的方法执行，是异步的
+ generator: async/await
  async 默认返回一个成功状态的promise
  await 后面一般会放置一个Promise实例，等待promise成功后的结果，就算不是promise实例，也会变成promise实例状态改为成功后执行await后面的代码
+ ...
#### 事件队列
+ JS渲染进程先进行词法分析,吧页面中即将要执行的代码都作为一个个的任务(不管同步异步),放在任务队列的宏任务中,然后词法分析完,再从宏任务队列中把这些任务拿出来自上而下逐一执行,**<font size="4" color="red">同步任务都是宏任务</font>**

+ **事件队列(Event Queue) => 等待任务队列**
浏览器加载页面就会创建一个 **事件队列**，用来存储待执行的任务,这个事件队列被称为**优先级队列**
优先级队列里面分为**宏任务队列(macroTask)** 和 **微任务队列(microTask)**
+ 将异步任务(定时器, 事件绑定)等放置到事件队列中浏览器会开辟一个新的线程=> **监听线程**
+ 监听线程监听异步任务是否达到指定执行时间(计时:监听线程)
+ **<font size="4" color="red">当同步任务都执行完, 主线程空闲下来后</font>**, 才会看事件队列是否存在等待的任务,如果存在并且达到条件(如定时器到达事件), **<font size="4" color="red">按照顺序一次把等待任务拿出来放到栈内存中,让JS主线程执行</font>**, 当此任务执行完, 主线程再次空闲下来后, 再去事件队列中查找, 我们把这个过程称之为  **<font size="4" color="red">Event Loop 事件循环机制</font>**
`
如果同步任务没有执行完,或者主线程没有空闲下来, 此时哪怕有异步任务已经符合了执行条件(定时器达到事件),但是也不会执行异步的任务,继续等待主线程空闲下来后, 才会去事件队列中按照顺序查找符合任务的异步任务
`
+ 查找过程
  1. 先在微任务队列查找如果有则按照顺序获取并执行
  2. 如果微任务队列中没有,则去宏任务队列中查找,在宏任务队列中,一般是按照谁先达到执行条件就先执行谁





