## this

#### this: ```函数的执行主体, 和执行上下文不是一个东西```
* 全区的this是window, 
* this是谁跟函数在哪执行,以及在哪定义都没有必然的联系

**按照以下规律来确定执行主体:**
1. 给当前元素的某个事件行为绑定方法, 时间触发, 执行对应的方法, 方法中的this是当前元素本身(排除:IE6~8基于attachEvent实现的DOM2事件绑定,绑定的方法中的this不是操作元素, 而是window)

```javascript
document.body.onclick = functin() {
  // this => body
}
```

2. 函数执行, 受限看函数名之前是否有".", 有的话 "." 前面就是this指向的对象, 没有的话指向的是window, 严格模式下给的是undefined
  &nbsp;&nbsp;&nbsp;+自执行函数中的this一般都是window/undefined
  &nbsp;&nbsp;&nbsp;+回调函数中的this一般都是window/undefined(除非特殊处理)

```javascript
function fn () {}
let obj = {
  name: 'obj',
  fn: fn
}

fn() // this => window/undefined
obj.fn // this => obj
```

3. 构造函数中的this是当前类的实例
4. 箭头函数没有自己的this, 用到的this都是上下文中的this
5. 基于call/apply/bind可以强制改变this指向

---
案例:
```javascript
var num = 10
var obj = {
  num: 20
}

obj.fn = (function(num){ // num = obj.num => 20
  this.num = num * 3;  // this => window   window.num = 20 * 3 => 60
  
  num ++  // num = 20 ++ => 21
  return function (n) {
    this.num += n;
    num ++;
    console.log(num)
  }
})(obj.num) // 20
var fn = obj.fn; 
fn(5) // this => window  window.num = 60 += 5  => 65  num ++ => 21 ++ => 22  log(22)
obj.fn(10) // this => obj  obj.num = 20 += 10  => 30  num ++ => 22 ++ => 23  log(23)
console.log(num, obj.num) // log(num => 65, obj.num => 30)
```