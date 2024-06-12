# Tapable

## 同步钩子

### SyncHook：是通过 SyncHook 注册的事件会依次执行

```javascript
const { SyncHook } = require('tapable')

// 实例化钩子函数，可以在这里定义形参
const syncHook = new SyncHook(['author', 'age'])

syncHook.intercept({
  // 每次调用 hook 实例的 tap() 方法注册回调函数时, 都会调用该方法,
  // 并且接受 tap 作为参数, 还可以对 tap 进行修改;
  register: (tapInfo) => {
    console.log(`${tapInfo.name} is doing its job`)
    return tapInfo // may return a new tapInfo object
  },
  // 通过hook实例对象上的call方法时候触发拦截器
  call: (arg1, arg2, arg3) => {
    console.log('Starting to calculate routes')
  },
  // 在调用被注册的每一个事件函数之前执行
  tap: (tap) => {
    console.log(tap, 'tap')
  },
  // loop类型钩子中 每个事件函数被调用前触发该拦截器方法
  loop: (...args) => {
    console.log(args, 'loop')
  },
})

// 注册事件
syncHook.tap('监听器1', (name, age) => {
  console.log('监听器1：', name, age)
})

syncHook.tap('监听器2', (name) => {
  console.log('监听器2：', name)
})

syncHook.tap('监听器3', (name, age) => {
  console.log('监听器3：', name, age)
})

// 触发事件，这里传的是实参，会被每一个注册的函数接收到
syncHook.call('wade', '25')

// 执行结果
/**
监听器1 is doing its job
监听器2 is doing its job
监听器3 is doing its job
Starting to calculate routes
{ type: 'sync', fn: [Function (anonymous)], name: '监听器1' } tap
监听器1： wade 25
{ type: 'sync', fn: [Function (anonymous)], name: '监听器2' } tap
监听器2： wade
{ type: 'sync', fn: [Function (anonymous)], name: '监听器3' } tap
监听器3： wade 25
*/
```

### SyncBailHook： 是一个保险类型的 Hook。

只要其中一个事件函数有返回值，后面的事件函数就不执行了

```javascript
const { SyncBailHook } = require('tapable')

const hook = new SyncBailHook(['author', 'age'])

hook.tap('测试1', (name, age) => {
  console.log('测试1接收参数：', name, age)
})

hook.tap('测试2', (name, age) => {
  console.log('测试2接收参数：', name, age)
  return 'outer'
})

hook.tap('测试3', (name, age) => {
  console.log('测试3接收参数：', name, age)
})

hook.call('wade', '25')

// 执行结果
/**
测试1接收参数： wade 25
测试2接收参数： wade 25
*/
```

第二个事件返回了 `outer`，因此第三个事件不会触发。

### SyncLoopHook：是一个循环类型的 Hook。

循环类型的含义是不停的循环执行事件函数，直到所有函数结果 **result === undefined**，不符合条件就返回从第一个事件函数开始执行。

```javascript
const { SyncLoopHook } = require('tapable')

const hook = new SyncLoopHook([])

let count = 5

hook.tap('测试1', () => {
  console.log('测试1里面的count：', count)
  if ([1, 2, 3].includes(count)) {
    return undefined
  } else {
    count--
    return '123'
  }
})

hook.tap('测试2', () => {
  console.log('测试2里面的count：', count)
  if ([1, 2].includes(count)) {
    return undefined
  } else {
    count--
    return '123'
  }
})

hook.tap('测试3', () => {
  console.log('测试3里面的count：', count)
  if ([1].includes(count)) {
    return undefined
  } else {
    count--
    return '123'
  }
})

//通过call方法触发事件
hook.call()

// 执行结果
/**
测试1里面的count： 5
测试1里面的count： 4
测试1里面的count： 3
测试2里面的count： 3

测试1里面的count： 2
测试2里面的count： 2
测试3里面的count： 2

测试1里面的count： 1
测试2里面的count： 1
测试3里面的count： 1
*/
```

### SyncWaterfallHook：是一个瀑布式类型的 Hook。

瀑布类型的钩子就是如果前一个事件函数的结果  **result !== undefined**，则 **result** 会作为后一个事件函数的第一个参数（也就是上一个函数的执行结果会成为下一个函数的参数）。

```javascript
const { SyncWaterfallHook } = require('tapable')

const hook = new SyncWaterfallHook(['author', 'age'])

hook.tap('测试1', (name, age) => {
  console.log('测试1接收参数：', name, age)
})

hook.tap('测试2', (name, age) => {
  console.log('测试2接收参数：', name, age)
  return '另外的名字'
})

hook.tap('测试3', (name, age) => {
  console.log('测试3接收参数：', name, age)
})

hook.call('wade', '25')

// 执行结果
/**
测试1接收参数： wade 25
测试2接收参数： wade 25
测试3接收参数： 另外的名字 25
*/
```

## 异步钩子

异步钩子需要通过 **tapAsync** 函数注册事件，同时也会多一个 **callback** 参数，执行 **callback** 告诉 该注册事件已经执行完成。**callback **函数可以传递两个参数** err **和** result**，一旦 **err** 不为空，则后续的事件函数都不再执行。异步钩子触发事件需要使用 **callAsync。**

### AsyncSeriesHook：是一个串行的钩子

```javascript
const { AsyncSeriesHook } = require('tapable')

const hook = new AsyncSeriesHook(['author', 'age']) // 先实例化，并定义回调函数的形参

console.time('time')

hook.tapAsync('测试1', (param1, param2, callback) => {
  console.log('测试1接收的参数：', param1, param2)
  setTimeout(() => {
    callback()
  }, 1000)
})

hook.tapAsync('测试2', (param1, param2, callback) => {
  console.log('测试2接收的参数：', param1, param2)
  setTimeout(() => {
    callback()
  }, 2000)
})

hook.tapAsync('测试3', (param1, param2, callback) => {
  console.log('测试3接收的参数：', param1, param2)
  setTimeout(() => {
    callback()
  }, 3000)
})

hook.callAsync('wade', '25', (err, result) => {
  // 等全部都完成了才会走到这里来
  console.log('这是成功后的回调', err, result)
  console.timeEnd('time')
})

// 执行结果
/**
测试1接收的参数： wade 25
测试2接收的参数： wade 25
测试3接收的参数： wade 25
这是成功后的回调 undefined undefined
time: 6.032
*/
```

### AsyncSeriesBailHook：是一个串行、保险类型的 hook。

一旦 **callback** 函数传递了参数，则不再执行后续的事件函数**。**

```javascript
const { AsyncSeriesBailHook } = require('tapable')

const hook = new AsyncSeriesBailHook(['author', 'age'])

console.time('time')

hook.tapAsync('测试1', (param1, param2, callback) => {
  console.log('测试1接收的参数：', param1, param2)
  setTimeout(() => {
    callback()
  }, 1000)
})

hook.tapAsync('测试2', (param1, param2, callback) => {
  console.log('测试2接收的参数：', param1, param2)
  setTimeout(() => {
    callback(false, '123')
  }, 2000)
})

hook.tapAsync('测试3', (param1, param2, callback) => {
  console.log('测试3接收的参数：', param1, param2)
  setTimeout(() => {
    callback()
  }, 3000)
})

hook.callAsync('wade', '25', (err, result) => {
  // 等全部都完成了才会走到这里来
  console.log('这是成功后的回调', err, result)
  console.timeEnd('time')
})

// 执行结果
/**
测试1接收的参数： wade 25
测试2接收的参数： wade 25
这是成功后的回调 null 123
time: 3.013s
*/
```

### AsyncSeriesWaterfallHook：是一个串行、瀑布式类型的 Hook。

如果前一个事件函数的 **callback **的参数 **result !== undefined**，则 **result** 会作为后一个事件函数的第一个参数（也就是上一个函数的执行结果会成为下一个函数的参数）。

```javascript
const { AsyncSeriesHook } = require('tapable')

const hook = new AsyncSeriesHook(['author', 'age'])

console.time('time')

hook.tapAsync('测试1', (param1, param2, callback) => {
  console.log('测试1接收的参数：', param1, param2)
  setTimeout(() => {
    callback()
  }, 1000)
})

hook.tapAsync('测试2', (param1, param2, callback) => {
  console.log('测试2接收的参数：', param1, param2)
  setTimeout(() => {
    callback(null, 2441)
  }, 2000)
})

hook.tapAsync('测试3', (param1, param2, callback) => {
  console.log('测试3接收的参数：', param1, param2)
  setTimeout(() => {
    callback()
  }, 3000)
})

hook.callAsync('wade', '25', (err, result) => {
  // 等全部都完成了才会走到这里来
  console.log('这是成功后的回调', err, result)
  console.timeEnd('time')
})

// 执行结果
/**
测试1接收的参数： wade 25
测试2接收的参数： 新名字A 25
测试3接收的参数： 新名字A 25
这是成功后的回调 null 新名字C
time: 6.043s
*/
```

### AsyncParallelHook：是一个串行的钩子

不需要等待上一个事件函数执行结束便可以执行下一个事件函数

```javascript
const { AsyncParallelHook } = require('tapable')

const hook = new AsyncParallelHook(['author', 'age'])

console.time('time')

hook.tapAsync('测试1', (param1, param2, callback) => {
  setTimeout(() => {
    console.log('测试1接收的参数：', param1, param2)
    callback()
  }, 2000)
})

hook.tapAsync('测试2', (param1, param2, callback) => {
  console.log('测试2接收的参数：', param1, param2)
  callback()
})

hook.tapAsync('测试3', (param1, param2, callback) => {
  console.log('测试3接收的参数：', param1, param2)
  callback()
})

// call 方法只有同步钩子才有，异步钩子得使用 callAsync
hook.callAsync('wade', '25', (err, result) => {
  // 等全部都完成了才会走到这里来
  console.log('这是成功后的回调', err, result)
  console.timeEnd('time')
})

// 执行结果
/**
测试2接收的参数： wade 25
测试3接收的参数： wade 25
测试1接收的参数： wade 25
这是成功后的回调 undefined undefined
time: 2.015s
*/
```

第一个事件设置了 2 秒的定时器再执行，此时会先执行后续的事件函数，等到 2 秒后再执行第一个事件函数。

### AsyncParallelBailHook：是一个串行、保险类型的钩子

若当前的事件函数的 **callback **的参数 **result !== undefined**，则后续的事件都不再执行。

```javascript
const { AsyncParallelBailHook } = require('tapable')

const hook = new AsyncParallelBailHook(['author', 'age'])

console.time('time')

hook.tapAsync('测试1', (param1, param2, callback) => {
  console.log('测试1接收的参数：', param1, param2)
  setTimeout(() => {
    callback()
  }, 1000)
})

hook.tapAsync('测试2', (param1, param2, callback) => {
  console.log('测试2接收的参数：', param1, param2)
  callback(null, '测试2有返回值啦')
})

hook.tapAsync('测试3', (param1, param2, callback) => {
  console.log('测试3接收的参数：', param1, param2)
  setTimeout(() => {
    callback(null, '测试3有返回值啦')
  }, 3000)
})

hook.callAsync('wade', '25', (err, result) => {
  // 等全部都完成了才会走到这里来
  console.log('这是成功后的回调', err, result)
  console.timeEnd('time')
})

// 执行结果
/**
测试1接收的参数： wade 25
测试2接收的参数： wade 25
这是成功后的回调 null 测试2有返回值啦
time: 3.015s
*/
```

由于第二个事件函数有返回值，因此第三个事件函数不会执行。<br />若第一个事件函数也有返回值，尽管是第二个事件函数先执行完成，但是 **callAsync** 拿到的结果依然是第一个事件函数的返回值，示例如下：

```javascript
const { AsyncParallelBailHook } = require('tapable')

const hook = new AsyncParallelBailHook(['author', 'age'])

console.time('time')

hook.tapAsync('测试1', (param1, param2, callback) => {
  console.log('测试1接收的参数：', param1, param2)
  setTimeout(() => {
    callback(null, '测试1有返回值啦')
  }, 3000)
})

hook.tapAsync('测试2', (param1, param2, callback) => {
  console.log('测试2接收的参数：', param1, param2)
  callback(null, '测试2有返回值啦')
})

hook.tapAsync('测试3', (param1, param2, callback) => {
  console.log('测试3接收的参数：', param1, param2)
  setTimeout(() => {
    callback(null, '测试3有返回值啦')
  }, 1000)
})

hook.callAsync('wade', '25', (err, result) => {
  // 等全部都完成了才会走到这里来
  console.log('这是成功后的回调', err, result)
  console.timeEnd('time')
})

// 执行结果
/**
测试1接收的参数： wade 25
测试2接收的参数： wade 25
这是成功后的回调 null 测试1有返回值啦
time: 3.009s
*/
```
