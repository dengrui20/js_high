/********** 浅克隆 ***************/
//=========== 对象
let obj1 = {
  name: '小明',
  language: {
    lang1: '英语',
    lang2: '中文'
  },
  [Symbol('flag')]: 1
}

// 方法1
let obj2 = {},keys = [...Object.keys(obj1),...Object.getOwnPropertySymbols(obj1)]
keys.forEach(key => {
  obj2[key] = obj1[key]
})


// 方法2
obj2 = {
  ...obj1
}

// 方法3
Object.assign(obj2, obj1)

console.log(obj2)

// ========== 数组
let arr1 = [1, 2, [1, 2]]

// 方法1 forEach/map
let arr2 = []
arr1.forEach((item, index) => arr2[index] = item)
arr2 = arr1.map(item => item)

// 方法2 slice/concat...
let arr2 = arr1.slice(0)
let arr2 = [].concat(arr1)

// 方法3
let arr2 = [...arr1]





/************ 深克隆 ***************/
let obj1 = {
  name: '小明',
  language: {
    lang1: '英语',
    lang2: '中文'
  },
  [Symbol('flag')]: 1,
  regExp: /^\d/, // JSON.stringify后变成 {}
  fn: function () { }  // JSON.stringify后被删除
}

// 方法1: JSON.stringify / JSON.parse
/**
 * 弊端:  JSON.stringify 会变成字符串 很多类型是不支持的
 *      * 正则/Math对象会变成空对象
 *      * 具备函数/Symbol/undefined属性值的属性会删除
 *      * BigInt处理不了  会报错
 *      * 日期对象最后会JSON.parse转回来的时候 还是个字符串
 *      * 无法拷贝不可枚举的属性；
 *      * 无法拷贝对象的原型链；
 *      * 对象中含有 NaN、Infinity 以及 -Infinity，JSON 序列化的结果会变成 null；
 */
let obj2 = JSON.parse(JSON.stringify(obj1))

// 方法二: 自定义函数实现
function getOwnProperty(obj) {
  if (!obj) return []
  return [
    ...Object.keys(obj1),
    ...Object.getOwnPropertySymbols(obj1)
  ]
}
// 类型验证
let toType = (function() {
  let class2type = {}
  let toString = class2type.toString;
  [
    'Boolean',
    'Number',
    'String',
    'Symbol',
    'Function',
    'Array',
    'Date',
    'RegExp',
    'Object',
    'Error'
  ].forEach((name) => {
    class2type["[object " + name + "]"] = name.toLowerCase()
  })

  return function (obj) {
    if (obj === null) {
      return obj + ''
    }
    return typeof obj === "object" || typeof obj === "function"
      ? class2type[toString.call(obj)] || "object"
      : typeof obj
  }
})()

// 浅克隆
function shallowClone(obj) {
  let type = toType(obj)
  // 基础类型直接返回
  if(/^(number|string|booleab|null|undefined|symbol|bigint)$/.test(type)) return obj
  if (/^(function)$/.test(type)) {
    // 如果是个函数 返回一个相同功能的函数
    return function proxy(...params) {
      return obj(...params)
    }
  }
  if (/^(regexp|date)$/.test(type)) {
    // 如果是正则或者日期对象 创建一个值一样但是不同实例的对象
    return new obj.constructor(obj)
  }
  if (/^(error)$/.test(type)) {
    // 如果是个错误对象
    return new Error(obj.message)
  }
  let keys = getOwnProperty(obj)
  let clone = {}
  Array.isArray(obj) && (clone = [])
  keys.forEach(key => {
    clone[key] = obj[key]
  })
  return clone
}

// 深克隆方法
function deepClone(obj, cache = new Set()) {
  // 只有数组和普通对象进行深克隆 其他进行浅克隆
  let type = toType(obj)
  if (/^(array|object)$/.test(type)) {
    if (cache.has(obj)) {
      // 查询该对象是否已经被clone过 防止对象自己递归引用自己 导致无限递归克隆
      return obj
    }
    cache.add(obj)
    let keys = getOwnProperty(obj)
    let clone = {}
    Array.isArray(obj) && (clone = [])
    keys.forEach(key => {
      clone[key] = deepClone(obj[key], cache)
    })
    return clone

  } else {
    return shallowClone(obj)
  }
}
console.log(deepClone(obj1))

