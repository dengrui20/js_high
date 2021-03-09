setTimeout(() => {
  console.log(1)
}, 20);

console.log(2)

setTimeout(() => {
  console.log(3)
}, 10);

console.log(4)

console.time('AA')

for(let i = 0; i < 90000000; i ++) {

}
console.timeEnd('AA')
console.log(5)
setTimeout(() => {
  console.log(6)
}, 8)

console.log(7)

setTimeout(() => {
  console.log(8)
}, 15)

console.log(9)
// => 同步 2  4  AA  5 7 9
// => 异步 3 1 6 8 

/**
 * 执行流程  
 *
 * 在for循环的执行完成之后 虽然time-20ms  time-10ms 到了时间
 * 但是主线程没有空闲 所以不能执行宏任务队列里的任务
 * js主线程将代码执行完成后
 * 宏任务队列分别有4个定时器
 * [time-20ms  time-10ms time-8ms time-15ms ]
 * 定时器谁先到时间先执行谁
 * 在for循环完成之前 time-20ms time-10ms 已经到时间
 * 所以先执行 time-20ms time-10ms
 * time-10ms 比 time-20ms
 * time-10ms 先执行
 * time-8ms 比 time-15ms 先到达时间
 * 所以执行顺序是 time-10ms -> time-20ms -> time-8ms -> time-15ms
*/

//======================================
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2() {
  console.log('async2');
}
console.log('script start');
setTimeout(function () {
  console.log('setTimeout');
}, 0)
async1();
new Promise(function (resolve) {
  console.log('promise1');
  resolve();
}).then(function () {
  console.log('promise2');
});
console.log('script end');

// script start -> promise1 -> script end -> async1 start -> async2 -> async1 end -> promise2 -> setTimeout

// 正确答案
/**
 *  script start
    async1 start
    async2
    promise1
    script end
    promise2
    async1 end
    setTimeout
 */

 /**
  * 执行流程
  * 创建 async1 async2
  * 设置定时器 time
  * 执行async1
  *    + await async2()
  *    + 同步执行async2()
  *    + await后面的代码 需要将async2的结果变成一个promise resolve后才会执行
  *    + async1-resolve 放入微任务队列
  * 执行 new Promise(executor) executor立即执行
  *   + executor 里的promise-resolve放入微任务队列
  * 
  * 主线程空闲后
  * 先检查微任务队列里有 [async1-resolve, promise-resolve]
  * 执行 async1-resolve 执行后 在执行async1里await后面的代码
  * 在执行 promise-resolve
  * 最后执行定时器
  */


  //===================

let body = document.body;

body.addEventListener('click', function () {
  Promise.resolve().then(() => {
    console.log(1);
  });
  console.log(2);
});

body.addEventListener('click', function () {
  Promise.resolve().then(() => {
    console.log(3);
  });
  console.log(4);
});

// 2 1 4 3
/**
 * 同步绑定2个点击事件
 * 将click1 和click2 推入宏任务栈 [click1, click2]
 * 点击触发事件
 * 在宏任务取出click1 放到主线程执行
 * promise.resolve1() 放到微任务队列
 * log(2)
 * 主线程代码执行完成
 * 在微任务取出 promise.resolve1() 执行 => log(1)
 * 微任务执行完成 查看宏任务
 * 发现宏任务队列还有click2
 * 在宏任务取出click2 放到主线程执行
 * promise.resolve2() 放到微任务队列
 * log(4)
 * 主线程代码执行完成
 * promise.resolve2() 执行 => log(3)
*/



//===============================

console.log('start');
let intervalId;
Promise.resolve().then(() => {
  console.log('p1');
}).then(() => {
  console.log('p2');
});
setTimeout(() => {
  Promise.resolve().then(() => {
    console.log('p3');
  }).then(() => {
    console.log('p4');
  });
  intervalId = setInterval(() => {
    console.log('interval');
  }, 3000);
  console.log('timeout1');
}, 0);

// start => p1 => p2 => timeout1 => p3 => p4 => interval


// ========================

setTimeout(() => {
  console.log('a');
});
Promise.resolve().then(() => {
  console.log('b');
}).then(() => {
  return Promise.resolve('c').then(data => {
    setTimeout(() => {
      console.log('d')
    });
    console.log('f');
    return data;
  });
}).then(data => {
  console.log(data); 
});

// b =>  f => c => a => d


// ==========================

function func1() {
  console.log('func1 start');
  return new Promise(resolve => {
    // fn1-resolve
    resolve('OK');
  });
}

function func2() {
  console.log('func2 start');
  return new Promise(resolve => {
    // fn2-resolve
    setTimeout(() => {
      // fn2-time2
      resolve('OK');
    }, 10);
  });
}

console.log(1);
setTimeout(async () => {
 // time1
  console.log(2);
  await func1();
  console.log(3);
}, 20);
for (let i = 0; i < 90000000; i++) { } //循环大约要进行80MS左右

console.log(4);

func1().then(result => {
  console.log(5);
});

func2().then(result => {
  console.log(6);
});

setTimeout(() => {
  // time2
  console.log(7);
}, 0);
console.log(8);

// 微任务队列 [  ]
// 宏任务队列 [  ]

// 1 => 4 => func1 start => func2 start => 8 => 5 => 2 => func1 start => 3 => 7 => 6





let arr = [1, 2, 3]

// 重写 Symbol.interator 接口
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

// 默认会调用arr上的[Symbol.interator] 方法

for (let item of arr) {
  console.log(item)
}


const func = x => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(++x)
    }, 1000)
  })
}

// func(0).then((data) => {
//   console.log(data)
//   return func(data)
// }).then((data) => {
//   console.log(data)
//   return func(data)
// }).then((data) => {
//   console.log(data)
// })

function* func2(x) {
  let r = yield func(x)
  console.log(r)
   r = yield func(r)
  console.log(r)
   r = yield func(r)
  console.log(r)
}
// let iterator = func2(0)
// let r = iterator.next()
// r.value.then((result) => {
//   r = iterator.next(result)
//   r.value.then(result => {
//     r = iterator.next(result)
//     r.value.then(result => {
//       r = iterator.next(result)
//     })
//   })
// })

function AsyncFn(generatorFunction, ...parmars) {
  let iterator = generatorFunction(...parmars)
  const next = (x) => {
    const { value, done } = iterator.next(x)
    if(done) return 
    value.then(x => next(x))
  }
  next()
}


AsyncFn(func2, 0)

