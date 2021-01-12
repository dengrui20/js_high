
console.log(parseInt(''),  //    NaN
Number(''), // 0
isNaN(""), // false
parseInt(null), // NaN
Number(null), // 0
isNaN(null),  //   false
parseInt("12px"),  // 12
Number('12px'), // NaN
isNaN('12px'), // false
parseFloat('1.6px') + parseInt('1.2px') + typeof parseInt(null) , // 1.6 + 1 + 'number'
isNaN(Number(!!Number(parseInt('0.8')))),  // false
typeof !parseInt(null) + !isNaN(null)  // 'boolean' +  true
)

let result = 10 + false + undefined + [] + 'Tencent' + null + true + {}
             // 10 +  0 +     NaN        + 0 +  'Tencent' +  'null'  + 'true' + '[object Object]'
console.log(result)
          
let arr = [10.18,0,10,25, 23]

          
console.log(arr.map(parseInt)) // 10 NaN 2 2 11 

/**
 * 对象转换为数字: 先toString转换为字符串(应该是先基于valueOf找原始值,没有原始值再去toString)
 * 再转换为数字
 * 
 * 其他类型转换为字符串: 一般都是直接""抱起来,只有{}普通对象调取toString是调取的Object.prototype.toString,
 * 不是转换为字符串,而是检测数据类型,返回结果是"[object Object]"
 * 
 * 对象变为数字: 应该先valueOf, 没有原始值在toString变为字符串,最后吧字符串转换为数字
 * 
 * Number: 只要遇到一个非有效数字字符串 就返回NaN   "" => 0 ; null => 0 ; undefined => NaN
 * 
 * isNaN: 检测的时候回会先调用Number去转换后再检测
 * 
 * parseInt: 从左侧第一个字符开始,查找有效数字字符(遇到非有效数字字符停止查找,
 * 不论后面时候还有数字字符,都不会再找了),把找到有效数字字符转换为数字,如果一个都没找
 * 到结果就是NaN(parseFloat比他多识别一个小数点)
 * 
 * parseInt: 第二个参数为转换的基数 有效进制为 0 ~ 36, parseFloat没有这个参数
 * parseInt('42', 5)  5进制为基数 有效数字为 0 1 2 3 4  转换为10进制  4 * 5^2 + 2 * 5^0 = 102
 * parseInt('57', 6)  6进制为基数 有效数字为 0 1 2 3 4 5  一个个查找 发现7不是有效数字 找到5后就结束 转换为10进制  5 * 6^0 = 5
 */
