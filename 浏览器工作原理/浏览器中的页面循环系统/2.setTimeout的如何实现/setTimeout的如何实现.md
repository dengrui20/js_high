## setTimeout的如何实现

#### 浏览器怎么实现 setTimeout

当通过 JavaScript 调用 setTimeout 设置回调函数的时候，渲染进程将会创建一个回调任务，包含了回调函数 showName、当前发起时间、延迟执行时间

创建好回调任务之后，再将该任务添加到延迟执行队列中

处理完消息队列中的一个任务之后, 就会不停的查找延迟队列中是否有到期的任务,等到期的任务执行完成之后，再继续下一个循环过程


#### 使用 setTimeout 的一些注意事项

1. 如果当前任务执行时间过久，会影延迟到期定时器任务的执行(阻塞)
2. 如果 setTimeout 存在嵌套调用，那么系统会设置最短时间间隔为 4 毫秒
```js
  // 定时器被嵌套调用 5 次以上，系统会判断该函数方法被阻塞了，
  // 如果定时器的调用时间间隔小于 4 毫秒，
  // 那么浏览器会将每次调用的时间间隔设置为4 毫秒
  function cb() { 
    setTimeout(cb, 0)
  }
  setTimeout(cb, 0)

```
3. 未激活的页面，setTimeout 执行最小间隔是 1000 毫秒
`如果标签不是当前的激活标签，那么定时器最小的时间间隔是 1000 毫秒，目的是为了优化后台页面的加载损耗以及降低耗电量。这一点你在使用定时器的时候要注意`
4. 延时执行时间有最大值
Chrome、Safari、Firefox 都是以 32 个 bit 来存储延时值的,32bit 最大只能存放的数字是 2147483647 毫秒,如果 setTimeout 设置的延迟值大于 2147483647 毫秒（大约) 24.8 天

5. 使用 setTimeout 设置的回调函数中的 this 不符合直觉

