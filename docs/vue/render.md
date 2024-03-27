# h()、渲染函数、渲染器

在平常开发阶段我们总是分不清虚拟 DOM、 `h()` 函数、渲染函数和渲染器的知识。笔者在翻阅相关文档之后，总结了下面这些知识点。

`h()` 函数用于创建虚拟 DOM，渲染函数的作用就是返回虚拟 DOM。因此，我们可以在渲染函数中使用 `h()` 创建虚拟 DOM 节点，并将 `h()` 函数创建出来的节点作为渲染函数的结果进行返回。

在 `Vue3` 中，框架的渲染器会将渲染函数返回的虚拟 DOM 节点渲染成真实 DOM 节点，数据流动实例如下：

![](https://gitee.com/YD580230/pic/raw/master/202403271013272.png)



## 虚拟 DOM

虚拟 DOM (Virtual DOM，简称 VDOM），是使用 Javascript 对象来描述 UI 的方式。这个对象会与真实的 DOM 保持同步，下面我会举个例子来说明：

```js
const vnode = {
  tag: "div",
  props: {
    id: "container",
    class: "header",
    onClick: () => {},
  },
  children: [
    /** 更多 vnode */
  ],
};

```

上面的 `vnode` 就是一个虚拟 DOM，它代表了一个 `<div>` 元素。



## [h() 函数](https://cn.vuejs.org/api/render-function.html#h)

`h()` 函数用于辅助创建虚拟 DOM 节点，它是 `hypescript` 的简称————能生成 HTML (超文本标记语言) 的 JavaScript，它有另外一个名称，叫做 `createVnode()`。


`h()`函数接收参数如下：

- `type`：类型参数，必填。内容为字符串或者 `Vue` 组件定义。
- `props`：props参数，非必填。传递内容是一个对象，对象内容包括了即将创建的节点的属性，例如 `id`、`class`、`style`等，节点的事件监听也是通过 props 参数进行传递，并且以 `on` 开头，以 `onXxx` 的格式进行书写，如 `onInput`、`onClick` 等。
- `children`：子节点，非必填。内容可以是文本、虚拟 DOM 节点和插槽等等。

官方完整类型参数如下：

```js
// 完整参数签名
function h(
  type: string | Component,
  props?: object | null,
  children?: Children | Slot | Slots
): VNode

// 省略 props
function h(type: string | Component, children?: Children | Slot): VNode

type Children = string | number | boolean | VNode | null | Children[]

type Slot = () => Children

type Slots = { [name: string]: Slot }
```

使用方法如下：

```js
import { h } from 'vue'

// 只有 type 参数为必填
h('div')

// attribute 和 property 都可以用于 prop 
// Vue 会自动选择正确的方式来分配它
h('div', { id: 'vue3' } )
h('div', { class: 'group', innerHTML: 'hello Vue3' })
h('div', { onClick: () =>{} })

// children 为字符串
h('div', { id: 'vue3' }, 'hello Vue3')
// props 参数为空
h('div', 'hello Vue3')

// children 嵌套使用
h('div', ['hello', h('span', 'Vue3')])
```

## 渲染函数

渲染函数描述了一个组件需要渲染的内容，它的作用是把虚拟 DOM 返回。

```js
export default {
  render() {
    return {
      tag: "h1",
      props: { onClick: () => {} },
    };
    // 上面的代码等价于 return h('h1', { onClick: () => {} })
  },
};
```
`Vue.js` 会根据组件的 `render` 函数的返回值拿到虚拟 DOM，然后框架的渲染器就会将虚拟 DOM 渲染为真实 DOM。

## 渲染器

渲染器的作用就是把虚拟 DOM 对象渲染为真实 DOM 元素，如图所示

![3](https://gitee.com/YD580230/pic/raw/master/202403271014563.png)

它的工作原理是，递归遍历虚拟 DOM 对象，并调用原生 DOM API 来创建真实 DOM 元素，在虚拟 DOM 发生变化时，会通过 `Diff` 算法找出变更点，并只更新需要更新的内容。

渲染器接收如下两个参数：

- `vnode`： 虚拟 DOM 对象。
- `container`：一个真实的 DOM 元素，作为虚拟 DOM 的挂载点，渲染器会把虚拟 DOM 挂载到该元素下。

渲染器的实现思路如下：

1. 创建元素：把 `vnode.tag` 作为标签名，创建对应的 DOM 元素。
2. 为元素添加属性和事件：遍历 `vnode.props` 对象，如果 key 以 `on` 开头，说明该属性是一个事件。把字符 `on` 去除并调用 `toLowerCase` 函数将事件名称小写化，会得到一个合法的事件名称，例如，`onClick` 会转变成 `click`，最终通过 `addEventListener` 绑定事件。
3. 处理 children： 如果 children 是字符串，则使用 `createTextNode` 函数创建一个文本节点，并将该节点添加到新创建的 DOM 元素内；如果 children 是一个数组，则递归调用渲染器函数继续渲染，此时挂载点会变成当前新建的 DOM 元素。

简易实现如下：

```js
function renderer(vnode, container) {
  if (typeof vnode.tag === "string") {
    // 说明 vnode 描述的是普通标签元素
    mountElement(vnode, container);
  } else if (typeof vnode.tag === "function") {
    // 说明 vnode 描述的是函数式组件
    mountComponent(vnode, container);
  } else if (typeof vnode.tag === "object") {
    // 说明 vnode 描述的是对象式组件
    const vDom = vnode.tag.render(); // 获取该对象的渲染函数返回的虚拟 DOM
    mountComponent(vDom, container);
  }
}

function mountElement(vnode, container) {
  // 使用 vnode.tag 创建 DOM 元素
  const el = document.createElement(vnode.tag);

  // 遍历 vnode.props, 将属性与事件绑定到 DOM 元素上
  for (const key in vnode.props) {
    if (/^on/.test(key)) {
      // 如果 key 以字符传 on 开头,表示它是个事件
      const eventName = key.substring(2).toLowerCase(); // 例: onClick -> click
      el.addEventListener(eventName, vnode.props[key]); // 注册事件
    }
  }

  // 处理 children
  if (typeof props.children === "string") {
    // 如果 children 为字符串,则说明当前节点是个文本节点
    el.appendChild(document.createTextNode(props.children));
  } else if (Array.isArray(props.children)) {
    // 如果 children 为数组,则递归调用 renderer 函数渲染子节点,此时挂载点为当前节点
    vnode.children.forEach((childNode) => renderer(childNode, el));
  }

  // 将元素添加到挂载点下
  container.appendChild(el);
}

function mountComponent(vnode, container) {
  // 调用组件函数,获取组件要渲染的内容(虚拟 DOM)
  const subtree = vnode.tag;
  // 递归调用 renderer 渲染 subtree
  renderer(subtree, container);
}

```

## 总结

`Vue.js` 包含了编译器和渲染器。编译器会将 vue 文件中的 `template` 模板内容编译成渲染函数，并挂载到 `script` 导出的对象中，编译器编译后的渲染函数返回的 DOM 会包含 `patchFlag` 属性，该属性标识了哪些内容是会动态变更的。渲染器会遍历渲染函数返回的 DOM，并生成对应的真实 DOM，在页面内容发生变化时，渲染器会根据 `patchFlag` 属性，动态更新对应内容，从而提升性能。用户可以通过 `h()` 函数动态创建虚拟 DOM并返回。

![4](https://gitee.com/YD580230/pic/raw/master/202403271015536.png)

PS. 我们日常使用的 `import { render } from 'vue'` 得到的 `render` 方法，其实是渲染器方法。

