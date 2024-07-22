# Typescript 装饰器标准语法

## 一、类型定义和结构

在语法上，装饰器有如下几个特征。

（1）第一个字符是 `@`，后面是一个表达式。
（2）`@` 后面的表达式，必须是一个函数（或者执行后可以得到一个函数）。
（3）这个函数接受所修饰对象的一些相关值作为参数。
（4）这个函数要么不返回值，要么返回一个新对象取代所修饰的目标对象。

装饰器类型定义如下：

```ts
type Decorator = (
  /** 所装饰的对象 */
  value: DecoratedValue,
  context: {
    /** 类型：'class'| 'method'| 'getter'| 'setter'| 'accessor'| 'field'  */
    kind: string
    /** 装饰的对象名称，如类名或方法名 */
    name: string | symbol
    /** 用于添加类的初始化逻辑 */
    addInitializer?(initializer: () => void): void
    /** 是否是静态成员 */
    static?: boolean
    /** 是否是私有成员 */
    private?: boolean
    access: {
      get?(): unknown
      set?(value: unknown): void
    }
  }
) => void | ReplacementValue
```

## 二、类装饰器

类装饰器结构如下，除了基本的 `kind` 和 `name` 属性外，还包含 `addInitializer` 方法用于初始化。

```ts
function userDecorator(value: any, context: any) {
  console.log(`类型为： ${context.kind}，名称为：${context.name}`)
  context.addInitializer(function () {
    value.prototype.level = 1
  })
  return value
}

@userDecorator
class User {
  age: number
  constructor(age: number) {
    this.age = age
  }
}

const liming = new User(18)
const lihua = new User(19)

console.log('liming 等级：' + liming.level)
liming.level = 2
console.log('liming 等级：' + liming.level)
console.log('lihua 等级：' + lihua.level)

// "类型为： class，名称为：User"
// "liming 等级：1"
// "liming 等级：2"
// "lihua 等级：1"
```

## 三、方法装饰器

方法装饰器结构如下：

```ts
type ClassMethodDecorator = (
  value: Function,
  context: {
    kind: 'method'
    name: string | symbol
    static: boolean
    private: boolean
    access: { get: () => unknown }
    addInitializer(initializer: () => void): void
  }
) => Function | void
```

若装饰器返回一个函数，则会替换掉该装饰器所装饰的方法，示例如下：

```ts
function replaceMethod() {
  return function () {
    return `How are you, ${this.name}?`
  }
}

class Person {
  constructor(name) {
    this.name = name
  }

  @replaceMethod
  hello() {
    return `Hi ${this.name}!`
  }
}

const robin = new Person('Robin')

console.log(robin.hello()) // 'How are you, Robin?'
```

## 四、属性装饰器

属性装饰器结构如下：

```ts
type ClassFieldDecorator = (
  value: undefined,
  context: {
    kind: 'field'
    name: string | symbol
    static: boolean
    private: boolean
    access: { get: () => unknown; set: (value: unknown) => void }
    addInitializer(initializer: () => void): void
  }
) => (initialValue: unknown) => unknown | void
```

属性装饰器要么不返回值，要么返回一个函数，该函数会自动执行，用来对所装饰属性进行初始化。该函数的参数是所装饰属性的初始值，该函数的返回值是该属性的最终值。

```ts
function logged(value: undefined, context: ClassFieldDecoratorContext) {
  const { kind, name } = context
  if (kind === 'field') {
    return function (initialValue: string) {
      console.log(`initializing ${name} with value ${initialValue}`)
      return initialValue
    }
  }
}

class Color {
  @logged
  name = 'green'
}

const color = new Color()
// "initializing name with value green"
```

上面示例中，属性装饰器 `@logged` 装饰属性 `name`。`@logged` 的返回值是一个函数，该函数用来对属性 `name` 进行初始化，它的参数 `initialValue` 就是属性 `name` 的初始值 `green`。新建实例对象 `color` 时，该函数会自动执行。

## 五、getter 装饰器，setter 装饰器

结构如下：

```ts
type ClassGetterDecorator = (
  value: Function,
  context: {
    kind: 'getter'
    name: string | symbol
    static: boolean
    private: boolean
    access: { get: () => unknown }
    addInitializer(initializer: () => void): void
  }
) => Function | void

type ClassSetterDecorator = (
  value: Function,
  context: {
    kind: 'setter'
    name: string | symbol
    static: boolean
    private: boolean
    access: { set: (value: unknown) => void }
    addInitializer(initializer: () => void): void
  }
) => Function | void
```

`getter` 装饰器的上下文对象 `context` 的 `access` 属性，只包含 `get()` 方法；`setter` 装饰器的 `access` 属性，只包含 `set()` 方法。

这两个装饰器要么不返回值，要么返回一个函数，取代原来的取值器或存值器。

```ts
class C {
  @lazy
  get value() {
    console.log('正在计算……')
    return '开销大的计算结果'
  }
}

function lazy(value: any, { kind, name }: any) {
  if (kind === 'getter') {
    return function (this: any) {
      const result = value.call(this)
      Object.defineProperty(this, name, {
        value: result,
        writable: false,
      })
      return result
    }
  }
  return
}

const inst = new C()
inst.value
// 正在计算……
// '开销大的计算结果'
inst.value
// '开销大的计算结果'
```

## 六、accessor 装饰器

结构如下

```ts
type ClassAutoAccessorDecorator = (
  value: {
    get: () => unknown
    set: (value: unknown) => void
  },
  context: {
    kind: 'accessor'
    name: string | symbol
    access: { get(): unknown; set(value: unknown): void }
    static: boolean
    private: boolean
    addInitializer(initializer: () => void): void
  }
) => {
  get?: () => unknown
  set?: (value: unknown) => void
  init?: (initialValue: unknown) => unknown
} | void
```

`accessor` 装饰器的 `value` 参数，是一个包含 `get()` 方法和 `set()` 方法的对象。该装饰器可以不返回值，或者返回一个新的对象，用来取代原来的 `get()` 方法和 `set()` 方法。此外，装饰器返回的对象还可以包括一个 `init()` 方法，用来改变私有属性的初始值。

```ts
class C {
  @logged accessor x = 1
}

function logged(value, { kind, name }) {
  if (kind === 'accessor') {
    let { get, set } = value

    return {
      get() {
        console.log(`getting ${name}`)

        return get.call(this)
      },

      set(val) {
        console.log(`setting ${name} to ${val}`)

        return set.call(this, val)
      },

      init(initialValue) {
        console.log(`initializing ${name} with value ${initialValue}`)
        return initialValue
      },
    }
  }
}

let c = new C()

c.x
// getting x

c.x = 123
// setting x to 123
```

## 七、装饰器的执行顺序

装饰器的执行分为两个阶段。

（1）评估（evaluation）：计算@符号后面的表达式的值，得到的应该是函数。

（2）应用（application）：将评估装饰器后得到的函数，应用于所装饰对象。

也就是说，装饰器的执行顺序是，先评估所有装饰器表达式的值，再将其应用于当前类。

应用装饰器时，顺序依次为方法装饰器和属性装饰器，然后是类装饰器。

例子如下：

```ts
function d(str: string) {
  console.log(`评估 @d(): ${str}`)
  return (value: any, context: any) => console.log(`应用 @d(): ${str}`)
}

function log(str: string) {
  console.log(str)
  return str
}

@d('类装饰器')
class T {
  @d('静态属性装饰器')
  static staticField = log('静态属性值');

  @d('原型方法')
  [log('计算方法名')]() {}

  @d('实例属性')
  instanceField = log('实例属性值')

  @d('静态方法装饰器')
  static fn() {}
}
```

上面示例中，类 T 有四种装饰器：类装饰器、静态属性装饰器、方法装饰器、属性装饰器。运行结果如下：

> 评估 @d(): 类装饰器
> 评估 @d(): 静态属性装饰器
> 评估 @d(): 原型方法
> 计算方法名
> 评估 @d(): 实例属性
> 评估 @d(): 静态方法装饰器
> 应用 @d(): 静态方法装饰器
> 应用 @d(): 原型方法
> 应用 @d(): 静态属性装饰器
> 应用 @d(): 实例属性
> 应用 @d(): 类装饰器
> 静态属性值

可以看到，类载入的时候，代码按照以下顺序执行。

（1）装饰器评估：这一步计算装饰器的值，首先是类装饰器，然后是类内部的装饰器，按照它们出现的顺序。

注意，如果属性名或方法名是计算值（本例是“计算方法名”），则它们在对应的装饰器评估之后，也会进行自身的评估。

（2）装饰器应用：实际执行装饰器函数，将它们与对应的方法和属性进行结合。

静态方法装饰器首先应用，然后是原型方法的装饰器和静态属性装饰器，接下来是实例属性装饰器，最后是类装饰器。

注意，“实例属性值”在类初始化的阶段并不执行，直到类实例化时才会执行。

如果一个方法或属性有多个装饰器，则内层的装饰器先执行，外层的装饰器后执行。

```ts
function log(value: Function) {
  console.log('log===')
  return function (str: string) {
    return 'log ' + value(str)
  }
}

function bound(value: Function) {
  console.log('bound===')
  return function (str: string) {
    return 'bound ' + value(str)
  }
}

class Person {
  name: string
  constructor(name: string) {
    this.name = name
  }

  @bound
  @log
  greet(value) {
    return 'greet ' + value
  }
}

const A = new Person('tom')

console.log(A.greet('222'))

// "log==="
// "bound==="
// "bound log greet 222"
```

上面示例中，`greet()` 有两个装饰器，内层的 `@log` 先执行，外层的 `@bound` 针对得到的结果再执行。
