# 自动读取文件

- `webpack` 项目中读取某个文件夹下的特定文件的写法如下：

```js
const requireComponent = require.context(
  // 其组件目录的相对路径
  './components',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach((fileName) => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)
})
```

- `vite` 项目中读取某个文件夹下的特定文件的写法如下：

vite 版本大于 2 用法：

```js
const modules = import.meta.glob('./dir/*.js'， {eager: true})
Object.keys(modules).forEach((path: any) => {
  const module =  modules[path].default
})
```

vite 版本处于 2 用法：

```js
const routeModules = import.meta.globEager('@/views/**/router.js')
const routes = Object.keys(routeModules)
  .map((key) => routeModules[key].default)
  .flat()
```
