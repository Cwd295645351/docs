# Web Components

Web Components 是一种用于构建可复用的定制元素的技术，它允许开发者创建自定义的 HTML 标签，提供了一种在不同框架和库中共享组件的方式。本文将介绍 Web Components 的基本概念、编写和生命周期方法，以及在普通使用和 Vue 框架中的应用方法。

## 一、什么是 Web Components？

Web Components 是一组浏览器标准，它由四个主要技术组成：

- **Custom Elements**：允许开发者定义自己的 HTML 元素。
- **Shadow DOM**：提供了一种将样式和脚本封装起来，不被外部影响的方法。
- **HTML Templates**：允许开发者定义片段的模板，以便稍后在不同位置进行复制和粘贴。

## 二、编写 Web Components

### 1. 定义一个简单的 Web Component

```javascript
class MyCustomElement extends HTMLElement {
  constructor() {
    super()
    // 添加影子DOM
    const shadow = this.attachShadow({ mode: 'open' })

    // 创建一个span元素
    const span = document.createElement('span')
    span.textContent = 'Hello, World!'

    // 将span元素添加到影子DOM中
    shadow.appendChild(span)
  }
}

customElements.define('my-custom-element', MyCustomElement)
```

### 2. 生命周期

生命周期如下：

- **connectedCallback**： 当 _custom element_ 自定义标签首次被插入文档 DOM 时，被调用，类似于 **Vue** 中的 `mounted` 周期函数
- **disconnectedCallback**：当 _custom element_ 从文档 DOM 中删除时，被调用，类似于 **Vue** 中的 `destroyed` 周期函数
- **attributeChangedCallback**: 当静态属性 `observedAttributes` 中定义的属性被添加、修改、移除或替换时被调用

```javascript
class MyCustomElement extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    console.log('Element connected to the DOM')
  }

  disconnectedCallback() {
    console.log('Element removed from the DOM')
  }

  adoptedCallback() {
    console.log('Element moved to a new document')
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} changed from ${oldValue} to ${newValue}`)
  }
}

customElements.define('my-custom-element', MyCustomElement)
```

### 3. 自定义事件

在 Web Components 内部，可以通过自定义事件来进行与外部的通信。要在 Web Components 内部暴露自定义事件，可以使用`CustomEvent`类来创建并触发自定义事件。

```javascript
class MyCustomElement extends HTMLElement {
  constructor() {
    super()
    // ...其他初始化操作
  }

  // 定义一个自定义事件暴露方法
  exposeCustomEvent() {
    // 创建一个自定义事件，可以传递一些数据
    const event = new CustomEvent('customEventName', {
      detail: { message: 'Hello from custom event!' },
      bubbles: true, // 是否冒泡
      composed: true, // 是否能穿越 Shadow DOM
    })

    // 触发自定义事件
    this.dispatchEvent(event)
  }
}

customElements.define('my-custom-element', MyCustomElement)
```

在外部代码中，可以通过以下方式监听和响应这个自定义事件：

```javascript
const myCustomElement = document.querySelector('my-custom-element')

myCustomElement.addEventListener('customEventName', (event) => {
  console.log('Received custom event:', event.detail.message)
})
```

通过暴露自定义事件，Web Components 可以与外部环境进行有效的通信，从而实现更加灵活和可复用的组件。

### 4. 数据绑定

需要监听的属性需要放到静态属性 `observedAttributes` 中，这个属性是个数组，当 `observedAttributes` 属性中的属性发生变化时，会触发 `attributeChangedCallback()` 回调，回调参数包含属性名 `name`、变化前的值 `oldValue` 和变化后的值 `newValue`

```js
// 为这个元素创建类
class MyCustomElement extends HTMLElement {
  static observedAttributes = ['color', 'size']

  constructor() {
    super()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`属性 ${name} 已由 ${oldValue} 变更为 ${newValue}。`)
    this[name] = newValue
    this.updateDiv()
  }

  updateDiv() {
    const p = this.shadowRoot.querySelector('p')
    p.textContent = `颜色：${this.color}，尺寸：${this.size}`
  }
}

customElements.define('my-custom-element', MyCustomElement)
```

业务方使用方法如下：

```html
<my-custom-element id="customElement" size="100" color="red">4214</my-custom-element>
<button class="change-text">修改文案</button>

<script>
  const customElement = document.querySelector('#customElement')

  const changeBtn = document.querySelector('.change-text')
  changeBtn.onclick = function () {
    customElement.setAttribute('color', 'yellow')
    customElement.setAttribute('size', '300')
  }
</script>
```

### 5. 编写样式

有两种方法为 shadow DOM 添加样式：

1. 编程式，通过构建一个 **CSSStyleSheet** 对象并将其附加到影子根

> 1. 创建一个空的 `CSSStyleSheet` 对象
> 2. 使用 `CSSStyleSheet.replace()` 或 `CSSStyleSheet.replaceSync()` 设置其内容
> 3. 通过将其赋给 `ShadowRoot.adoptedStyleSheets` 来添加到影子根

```html
<div id="host"></div>
<span>I'm not in the shadow DOM</span>
<script>
  const sheet = new CSSStyleSheet()
  sheet.replaceSync('span { color: red; border: 2px dotted black;}')

  const host = document.querySelector('#host')

  const shadow = host.attachShadow({ mode: 'open' })
  shadow.adoptedStyleSheets = [sheet]

  const span = document.createElement('span')
  span.textContent = "I'm in the shadow DOM"
  shadow.appendChild(span)
</script>
```

2. 声明式，通过在一个 `<template>` 元素的声明中添加一个 `<style>` 元素。

```html
<template id="my-element">
  <style>
    span {
      color: red;
      border: 2px dotted black;
    }
  </style>
  <span>I'm in the shadow DOM</span>
</template>

<div id="host"></div>
<span>I'm not in the shadow DOM</span>

<script>
  const host = document.querySelector('#host')
  const shadow = host.attachShadow({ mode: 'open' })
  const template = document.getElementById('my-element')

  shadow.appendChild(template.content)
</script>
```

## 三、使用 Vue 构建 Web Component

Vue 提供了 `defineCustomElement` 方法来创建 `Web Component`，接收参数和 `defineComponent` 一样。

```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // 这里是同平常一样的 Vue 组件选项
  props: {},
  emits: {},
  template: `...`,

  // defineCustomElement 特有的：注入进 shadow root 的 CSS
  styles: [`/* inlined css */`],
})

// 注册自定义元素
// 注册之后，所有此页面中的 `<my-vue-element>` 标签
// 都会被升级
customElements.define('my-vue-element', MyVueElement)

// 你也可以编程式地实例化元素：
// （必须在注册之后）
document.body.appendChild(
  new MyVueElement({
    // 初始化 props（可选）
  })
)
```

组件中的 `emit` 触发的事件参数存放在 `CustomEvent` 对象的 `detail` 属性中，该属性是个数组

`defineCustomElement` 也可以搭配 `SFC` 使用。一个以自定义元素模式加载的 `SFC` 将会内联其 `<style>` 标签为 `CSS` 字符串，并将其暴露为组件的 `styles` 选项。这会被 `defineCustomElement` 提取使用，并在初始化时注入到元素的 `shadow root` 上。

开启该模式需要将组件文件以 `.ce.vue` 结尾
