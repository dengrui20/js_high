## var和let的区别
---

#### 1. `var 存在变量提升 let 不存在变量提升`

```javascript
console.log(a) // => ReferenceError: a is not defined
console.log(b) // => undefined
let a = 1
var b = 2
```

#### 2. `全局上下文中,基于var声明的变量,相当于给GO(全局对象)新增一个属性，任何一个发生值的改变，另外一个也会跟着改变(映射机制)let声明的变量，就是全局变量， 和GO没有关系`

```javascript
var c = 1
let d = 1
console.log(window.c) // => 1
console.log(window.d) // => undefined
```

#### 3. `let在相同的上下文当中不允许重复声明,无论之前使用何种方式声明,var可以重复声明`

```javascript
function test() {
  var a = 1
  var a = 2
  let b = 1
  let b = 2 
}

在代码执行之前词法分析阶段就会报错
console.log('test')
test() // Identifier 'b' has already been declared 
```

#### 4. `let 会产生块级私有上下文 var 不会`

```javascript
 {
  var e = 12
  console.log(e) // => 12

  let f = 13
  console.log(f) // => 13
 }

console.log(e) // => 12
console.log(f) // => ReferenceError: f is not defined
```


