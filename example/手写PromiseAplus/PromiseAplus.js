// https://promisesaplus.com/

var Promise = (function(window) {
  // 重写Promise
  var PENDING = 'pending'
  var FULFILLED = 'fulfilled'
  var REJECTED = 'rejected'

  /**
   * @param promise // then返回的promise实例 
   * @param invokResult // then内函数的执行结果
   * @param resolve // new Promise(executor) executor方法的回调
   * @param reject // new Promise(executor) executor方法的回调
   */
  function resolvePromise(promise, invokResult, resolve, reject) {
    // 根据then里面的函数执行结果修改then 返回promise实例的状态
    if (invokResult === promise) {
      //如果 onfulfilled/onreject方法的返回值和创建的新实例是同一个值会产生死循环
      /***
       * 如 var p2 = p1.then((val) {
       *    return p2
       *  }) 
       */
      throw new TypeError('error')
    }

    if ((invokResult !== null && typeof invokResult === "object") || typeof invokResult === "function") {
      // 如果是个普通对象(可能 promise 实例) 或者 是个函数
     
      try {
        // 通过判断 result对象是否拥有then 方法来判断是不是一个promise实例对象
        var then = invokResult.then 
        if (typeof then === "function") {
          // 调用返回的promise 实例的then 方法
          // 将根 promise 的resolve/reject 传入
          /**
           * var a = new Promise((res, rej) => {
           *  res(aaa)
           * })
           * 
           * var b = a.then((val) => {
           *    let invokResult = new Promise((res, rej) => {
           *        resolve(bbb)
           *    })
           * // 最后会执行 invokResult 的then 方法 
           *  return invokResult
           * })
           * 
           * b.then((val) => {
           *  return val
           * }, (reason) => {
           * 
           * })
           * 
           *
          */
            // 执行 invokResult 的then 方法， 收集根promise的esolve/reject
            // invokResult promise对象改变的时候 也会跟着改变then 返回的 promise实例的状态
            // 比如 上面案例 如果promise实例 invokResult最后reject
            //  a.then 返回的实例b 就会进入reject状态
            //  b.then 就会进入到 (reason) => {} 这个回调
          then.call(invokResult, 
          function (val) {
            resolve(val)
          },
          function (reason) {
            reject(reason)
          })
        } else {
          resolve(invokResult)
        }
      } catch (e) {
        reject(e)
      }
    } else {
      resolve(invokResult)
    }
    
  }
  function Promise(executor) {
    if (typeof executor !== "function") {
      throw new TypeError('executor is not a function')
    }

    var that = this

    that.promiseState = PENDING
    that.promiseResult = undefined
    that.onfulfilledCallbacks = [] // 收集then 里面的 成功回调
    that.onrejectedCallbacks = [] // 收集then 里面的 异常回调

    var run = function (state, result) {
      // 根据状态执行收集的函数
      if (that.promiseState === PENDING) {
        that.promiseState = state
        that.promiseResult = result
        setTimeout(function () {
          that['on' + state + 'Callbacks'].forEach(function (fn) {
            if (typeof fn === "function") {
              fn(that.promiseResult)
            }
          })
        })
      }
    }
    // resolve/reject 修改promise实例的状态和结果
    var resolve = function(val) {
      run(FULFILLED, val)
    }
    var reject = function (val) { 
      run(REJECTED, val)
    }

    // 立即执行传入的函数
    // 如果函数执行报错 promise 状态修改为rejected
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  Promise.resolve = function(value) {
    return new Promise(function (resolve) {
      resolve(value)
    })
  }
  Promise.reject = function(value) {
    return new Promise(function (resolve, reject) {
      reject(value)
    })
  }
  Promise.all = function (promiseArr) {
    promiseArr = promiseArr.filter(instance => instance instanceof Promise)
    var index = 0;
    var len = promiseArr.length
    var results = []

    var promise = new Promise((resolve, reject) => {
      promiseArr.forEach((promiseInstance, i) => {
        promiseInstance.then((result) => {
          index ++ 
          results[i] = result
          if (index === len) {
            resolve(results)
          }
        }).catch(function (e) {
          reject(e)
        })
      })
    })
    return promise
  }

  Promise.race = function (promiseArr) {
    promiseArr = promiseArr.filter(instance => instance instanceof Promise)
    var promise = new Promise((resolve, reject) => {
      promiseArr.forEach((promiseInstance) => {
        if (promiseInstance instanceof Promise) {
          promiseInstance.then((result) => {
            resolve(result)
          }).catch(function (e) {
            reject(e)
          })
        }
      })
    })
    return promise
  }

  Promise.prototype = {
    customize: true, 
    constructor: Promise,
    catch: function (onrejected) {
      return this.then(null, onrejected)
    },
    then: function(onfulfilled, onrejected) {
      if (typeof onfulfilled !== "function") {
        onfulfilled = function (val) {
          return val
        }
      }
      if (typeof onrejected !== "function") {
        onrejected = function (reason) {
          // 如果没有传onrejected回调 默认创建一个 实现透传reject功能
          throw reason
        }
      }
      var that = this;
      // then 返回的promise
      var promise = new Promise(function (resolve, reject) {
        var currentPromise = this

        var normizeFn = function (state, result) {
          // 如果that 这个实例状态已经发生改变 根据改变的状态进行处理
          var cb = state === FULFILLED ? onfulfilled : onrejected
          setTimeout(function () {
            // 如果是正常执行就返回正常状态的promise实例 如果执行报错就返回一个 状态为rejected的promise实例
            try {
              var r = cb(result)
                // 根据then里面的函数执行结果修改then 返回promise实例的状态
              resolvePromise(currentPromise, r, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        }
        if (that.promiseState !== PENDING) {
          normizeFn(that.promiseState, that.promiseResult)
        } else {
          // 如果promise的状态没有改变 先收集 等状态改变后执行
          // 嵌套一层匿名函数 可以在内部对 onfulfilled/onrejected的返回值做处理
          that.onfulfilledCallbacks.push(function (promiseResult) { 
            try {
              var r = onfulfilled(promiseResult)
              resolvePromise(currentPromise, r, resolve, reject)
            } catch (e) {
              reject(r)
            }
           })
          that.onrejectedCallbacks.push(function (promiseResult) {
            try {
              var r = onrejected(promiseResult)
              resolvePromise(currentPromise, r, resolve, reject)
            } catch (e) {
              reject(r)
            }
          })
        }
        // switch (that.promiseState) {
        //   case FULFILLED:
        //     setTimeout(function () { onfulfilled(that.promiseResult)})
        //     break;
        //   case REJECTED:
        //     setTimeout(function () { onrejected(that.promiseResult) })
        //     break;
        //     default: 
        //     that.onfulfilledCallbacks.push(onfulfilled)
        //     that.onrejectedCallbacks.push(onrejected)
        // }
      })

      // then 方法 返回一个新的promise 实例
      return promise
    }
  }
  return Promise
  // window.Promise = Promise
})()

var p1 = new Promise((resolve, reject) => {
  // setTimeout(() => {
  //   resolve('成功')
  // }, 1000)
  reject('失败')
})

p1.then(val => {
  console.log(val, 1)
  return Promise.resolve(val + ' Promise-then')
}).then(val => {
  console.log(val, 2)
}, reason => {
  console.log(reason, 2)
})

let p2 = new Promise((res, rej) => {
  setTimeout(() => {
    res(11111)
  }, 1200)
})

let p3 = new Promise((res, rej) => {
  setTimeout(() => {
    res(2222)
  }, 1500)
})

Promise.all([p2, p3, {}]).then((result) => {
  console.log(result)
})

// Promise.race([p2, p3]).then((results) => {
//   console.log(results)
// })