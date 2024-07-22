# qiankun 快速上手

## 一、主应用改造

首先需要维护一份微应用列表，里面包含了微应用的名称、入口和生效规则，若需要给子应用传递内容，可以在 props 传入对应的内容

```javascript
// app.js
const apps = [
  {
    name: 'micro-vue-app3',
    entry: '//localhost:3013',
    container: '#micro-vue-app3',
    activeRule: '/micro-vue3-app3',
    props: {},
  },
]

export default apps
```

有了微应用数据后，我们就开始注册微应用

```javascript
// micro.js

import { registerMicroApps, addGlobalUncaughtErrorHandler, start } from "qiankun"

import apps from "./app"

/** 注册微应用 */
registerMicroApps(apps, {
	// 微应用加载前
	beforeLoad: (app) => {
		console.log("before-load", app.name)
		return Promise.resolve()
	},
	beforeMount: (app) => {
		console.log("before mount", app)
		return Promise.resolve()
	},
	afterMount: (app) => {
		console.log("after mount", app.name)
		return Promise.resolve()
	}
})

addGlobalUncaughtErrorHandler((event: Event | string) => {
	console.error(event)
	const { message: msg } = event as any
	if (msg && msg.includes("died in status LOADING_SOURCE_CODE")) {
		console.error("微应用加载失败，请检查应用是否可运行")
	}
})

export default start
```

接下来，我们在项目的入口文件中启动微前端。

```js
import { createApp } from 'vue'
import router from './router'
import startQiankun from './micro'
import App from './App.vue'

// start()
startQiankun({
  sandbox: {
    experimentalStyleIsolation: true, // 样式隔离
  },
})

const app = createApp(App)
app.use(router)

app.mount('#app')
```

## 二、子应用改造

vue3 项目创建方式分为 vue-cli 创建和 vite 创建，vue-cli 底层是 webpack，两种方式创建的项目的改造内容不太一样，接下来便为各位介绍一下改造点。

### 1. vue-cli 创建 vue3 子应用

vue.config.js 配置，需要将输出文件格式改成 umd 库格式

```javascript
const { defineConfig } = require('@vue/cli-service')
const { name } = require('./package.json')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3013,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
    },
  },
})
```

创建 `public-path.ts`文件，动态设置 webpack publicPath 防止资源报错

```javascript
if (window.__POWERED_BY_QIANKUN__) {
  // 动态设置 webpack publicPath，防止资源加载出错
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}
```

`main.js`需要区分独立运行还是子应用运行

```javascript
import './public-path'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

let instance = null

function render(props = {}) {
  const { container } = props
  instance = createApp(App)
  instance.use(router)
  instance.use(store)
  instance.mount(container ? container.querySelector('#app') : '#app')
}

// 非乾坤环境
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}
export async function bootstrap() {
  console.log('初次注册================')
  console.log('[vue] vue app bootstraped')
}

export async function mount(props) {
  console.log('挂载子应用==============vue3-app')
  console.log(props)
  render(props)
  instance.config.globalProperties.$onGlobalStateChange = props.onGlobalStateChange
  instance.config.globalProperties.$setGlobalState = props.setGlobalState
}

export async function unmount() {
  console.log('子应用卸载==========')
  instance.unmount()
  instance._container.innerHTML = ''
  instance = null
}
```

### 2. vite 创建 vue3 子应用

vite 若要用在 qiankun 微前端，需要安装 `vite-plugin-qiankun` 插件支持，并修改 `vite.confit.ts`配置：

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    qiankun('vite-vue3-app3', {
      useDevMode: true,
    }),
  ],
  server: {
    port: 7001,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
})
```

在 `main.ts`文件中，需要引入 `renderWithQiankun`和 `qiankunWindow`

```javascript
// @ts-nocheck
import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import actions from './shared/action'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

let app

function render(props) {
  if (props) {
    // 注入 actions 实例
    actions.setActions(props)
  }
  const { container } = props
  app = createApp(App)
  app.use(router)
  app.mount(container ? container.querySelector('#app') : '#app')
}

const initQianKun = () => {
  renderWithQiankun({
    /**
     * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
     */
    mount(props) {
      console.log('vite 应用挂载', props)
      const { container } = props
      render(props)
    },
    /**
     * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
     * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
     */
    bootstrap() {
      console.log('vite-vue3 初始化')
    },
    /**
     * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
     */
    unmount() {
      console.log('vite-vue3 卸载')
      app.unmount()
    },
  })
}

qiankunWindow.__POWERED_BY_QIANKUN__ ? initQianKun() : render()
```

`router`路由的 window 对象也需要用 qiankunWindow 去替换:

```typescript
import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import HelloWorld from '../components/HelloWorld.vue'
import Text from '../components/Text.vue'

const routes: Array<RouteRecordRaw> = [{ path: '/', name: 'Home', component: HelloWorld, children: [{ path: 'text', name: 'Text', component: Text }] }]
const base = qiankunWindow.__POWERED_BY_QIANKUN__ ? '/vite-vue3-app3' : '/'

const router = createRouter({
  history: createWebHistory(base),
  routes,
})

export default router
```

## 三、Actions 通信

`qiankun` 内部提供了 `initGlobalState` 方法用于注册 `MicroAppStateActions` 实例用于通信，该实例有三个方法，分别是：

- `setGlobalState`：设置 `globalState` - 设置新的值时，内部将执行 浅检查，如果检查到 `globalState` 发生改变则触发通知，通知到所有的 观察者 函数。
- `onGlobalStateChange`：注册 观察者 函数 - 响应 `globalState` 变化，在 `globalState` 发生改变时触发该 观察者 函数。
- `offGlobalStateChange`：取消 观察者 函数 - 该实例不再响应 `globalState` 变化。

```js
import { initGlobalState, MicroAppStateActions } from 'qiankun'

const initialState = {}
const actions = initGlobalState(initialState)

const actions = actions.setGlobalState({
  userInfo: { name: '改变用户', ssga: '2515' },
  age: ++currentAge.value,
})

// onGlobalStateChange 第二个参数为 true，表示立即执行一次观察者函数
actions.onGlobalStateChange((state) => {
  console.log(state, 'state')
  const { userInfo, age } = state
  currUserInfo.value = userInfo
  currentAge.value = age
}, true)
```

## 四、总结

本文介绍了 vue3 接入 qiankun 的方法，希望有助于个人初次上手了解。也有些人认为 vue3 结合 vite 的话，使用无界的方法会更好，有时间也会去看看如何使用，欢迎各位友好交流讨论！
