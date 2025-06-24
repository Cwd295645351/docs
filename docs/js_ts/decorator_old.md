# Typescript 装饰器旧语法

## 一、类装饰器

```typescript
type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void
```

类装饰器应用于类（class），但实际上是应用于类的构造方法。

类装饰器有唯一参数，就是构造方法，可以在装饰器内部，对构造方法进行各种改造。如果类装饰器有返回值，就会替换掉原来的构造方法。

```typescript
type Constructor = {
  new (...args: any[]): {}
}

function decorator<T extends Constructor>(target: T) {
  return class extends target {
    value = 123
  }
}

@decorator
class Foo {
  value = 456
}

const foo = new Foo()
console.log(foo.value) // 123
```

## 二、方法装饰器

```typescript
type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void
```

方法装饰器一共可以接受三个参数。

- **target**：（对于类的静态方法）类的构造函数，或者（对于类的实例方法）类的原型。
- **propertyKey**：所装饰方法的方法名，类型为`string|symbol`。
- **descriptor**：所装饰方法的描述对象。

```typescript
function logger(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value

  descriptor.value = function (...args) {
    console.log('params: ', ...args)
    const result = original.call(this, ...args)
    console.log('result: ', result)
    return result
  }
}

class C {
  @logger
  add(x: number, y: number) {
    return x + y
  }
}

new C().add(1, 2)
// params:  1 2
// result:  3
```

## 三、属性装饰器

```typescript
type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void
```

属性装饰器函数接受两个参数。

- **target**：（对于实例属性）类的原型对象（prototype），或者（对于静态属性）类的构造函数。
- **propertyKey**：所装饰属性的属性名，注意类型有可能是字符串，也有可能是 Symbol 值。

属性装饰器不需要返回值，如果有的话，也会被忽略。

注意，属性装饰器的第一个参数，对于实例属性是类的原型对象，而不是实例对象（即不是`this`对象）。这是因为装饰器执行时，类还没有新建实例，所以实例对象不存在。

```typescript
function ValidRange(min: number, max: number) {
  return (target: Object, key: string) => {
    Object.defineProperty(target, key, {
      set: function (v: number) {
        if (v < min || v > max) {
          throw new Error(`Not allowed value ${v}`)
        }
      },
    })
  }
}

// 输出 Installing ValidRange on year
class Student {
  @ValidRange(1920, 2020)
  year!: number
}

const stud = new Student()

// 报错 Not allowed value 2022
stud.year = 2022
```

## 四、参数装饰器

```typescript
type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void
```

参数装饰器接受三个参数。

- **target**：（对于静态方法）类的构造函数，或者（对于类的实例方法）类的原型对象。
- **propertyKey**：所装饰的方法的名字，类型为`string|symbol`。
- **parameterIndex**：当前参数在方法的参数序列的位置（从 0 开始）。

该装饰器不需要返回值，如果有的话会被忽略。

```typescript
function log(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  console.log(`${String(propertyKey)} NO.${parameterIndex} Parameter`)
}

class C {
  member(@log x: number, @log y: number) {
    console.log(`member Parameters: ${x} ${y}`)
  }
}

const c = new C()
c.member(5, 5)
// member NO.1 Parameter
// member NO.0 Parameter
// member Parameters: 5 5
```

## 五、装饰器执行顺序

执行装饰器时，按照如下顺序执行。

1. 实例相关的装饰器。
2. 静态相关的装饰器。
3. 构造方法的参数装饰器。
4. 类装饰器。

同一级装饰器的执行顺序，是按照它们的代码顺序。但是，参数装饰器的执行总是早于方法装饰器

如果同一个方法或属性有多个装饰器，那么装饰器将顺序加载、逆序执行。

```typescript
function f(key: string): any {
  console.log('加载：', key)
  return function () {
    console.log('执行：', key)
  }
}

@f('类装饰器')
class C {
  @f('静态方法')
  static method() {}

  @f('方法1')
  m1(@f('参数1') foo: any) {}

  @f('属性1')
  @f('属性2')
  p1: number

  @f('方法2')
  m2(@f('参数2') foo: any) {}

  @f('属性2')
  p2: number

  constructor(@f('构造方法参数') a: any, b: any, c: any, d: any) {
    this.m1 = a
    this.p1 = b
    this.m2 = c
    this.p2 = d
  }
}
```

执行结果如下

> 加载：方法 1  
> 加载：参数 1  
> 执行：参数 1  
> 执行：方法 1  
> 加载：属性 1  
> 加载：属性 2  
> 执行：属性 2  
> 执行：属性 1  
> 加载：方法 2  
> 加载：参数 2  
> 执行：参数 2  
> 执行：方法 2  
> 加载：属性 2  
> 执行：属性 2  
> 加载：静态方法  
> 执行：静态方法  
> 加载：类装饰器  
> 加载：构造方法参数  
> 执行：构造方法参数  
> 执行：类装饰器
