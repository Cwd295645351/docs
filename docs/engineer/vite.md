# vite 原理

## 一、实现原理

它是基于浏览器的 type 为 module 的 script 可以直接下载 es module 模块实现的。

做了一个开发服务，根据请求的 url 来对模块做编译，调用 vite 插件来做不同模块的 transform。

但是 node_modules 下的文件有的包是 commonjs 的，并且可能有很多个模块，这时 vite 做了**预构建**也叫 `deps optimize`。

它用 esbuild 分析依赖，然后用 esbuild 打包成 esm 的包之后输出到 node_modules/.vite 下，并生成了一个 metadata.json 来记录 hash。

浏览器里用 max-age 强缓存这些预打包的模块，但是带了 hash 的 query。这样当重新 build 的时候，可以通过修改 query 来触发更新。

在开发时通过 connect 起了一个服务器，调用 vite 插件来做 transform，并且对 node_modules 下的模块做了预构建，用 esbuild 打包。

在生产环境用 rollup 来打包，因为 vite 插件兼容了 rollup 插件，所以也是用同样的插件来处理，这样能保证开发和生产环境代码一致。

此外，vite 还基于 chokidar 和 websocket 来实现了模块热更新。

这就是 vite 的实现原理。

回想下，不管是基于浏览器 es module import 实现的编译服务，基于 esbuild 做的依赖预构建，基于 hash query 做的强缓存和缓存更新，还是兼容 rollup 的 vite 插件可以在开发服务和 rollup 里同时跑，这些功能实现都挺巧妙的。

## 二、依赖预构建

由于 vite 的服务器将所有代码视为原生 ES 模块，因此需要将 CommonJS 或 UMD 发布的依赖项转化成 ESM。

vite 就借助了 esbuild 库(esbuild 是一个对 js 语法处理的库)，对用户使用的 CommonJS 规范的库进行了转换成 ESM，并且输入在了 node_module/.vite/deps 目录下。

一来可以统一 ESM 模块，统一模块规范。
二来可以解决路径问题，方便路径重写。
三来可以优化 http 多包传输的性能问题。

它会基于以下几个来源来决定是否需要重新运行预构建步骤：

- 包管理器的锁文件内容，例如 `package-lock.json`，`yarn.lock`，`pnpm-lock.yaml`，或者 `bun.lockb`；
- 补丁文件夹的修改时间；
- `vite.config.js` 中的相关字段；
- `NODE_ENV` 的值。

只有在上述其中一项发生更改时，才需要重新运行预构建。

## 三、环境变量

vite 对环境变量的处理是借助于第三方库 dotenv 实现的，执行命令的时候，dotenv 会去读取 .env 文件，然后注入到 process 对象当中。用户可以使用 import.meta.env 去获取环境变量。下面是内建变量：

- **import.meta.env.MODE**: {string} 应用运行的模式。
- **import.meta.env.BASE_URL**: {string} 部署应用时的基本 URL。他由 base 配置项决定。
- **import.meta.env.PROD**: {boolean} 应用是否运行在生产环境（使用 `NODE_ENV='production'` 运行开发服务器或构建应用时使用 `NODE_ENV='production'` ）。
- **import.meta.env.DEV**: {boolean} 应用是否运行在开发环境 (永远与 `import.meta.env.PROD` 相反)。
- **import.meta.env.SSR**: {boolean} 应用是否运行在 server 上

用户自定义的环境变量需要以 `VITE\_` 为前缀才能获取到，例如下面的环境变量

> VITE_SOME_KEY=123
>
> DB_PASSWORD=foobar

只有 `VITE_SOME_KEY` 会被暴露为 `import.meta.env.VITE_SOME_KEY` 提供给客户端源码，而 `DB_PASSWORD` 则不会。

```js
console.log(import.meta.env.VITE_SOME_KEY) // "123"
console.log(import.meta.env.DB_PASSWORD) // undefined
```

## 四、vite 插件系统

开发阶段，Vite 会调用一系列与 Rollup 兼容的钩子，这个钩子主要分为三个阶段：

- **服务器启动阶段**: options 和 buildStart 钩子会在服务启动时被调用。
- **请求响应阶段**: 当浏览器发起请求时，Vite 内部依次调用 resolveId、load 和 transform 钩子。
- **服务器关闭阶段**: Vite 会依次执行 buildEnd 和 closeBundle 钩子。除了以上钩子，其他 Rollup 插件钩子(如 moduleParsed、renderChunk )均不会在 Vite 开发阶段调用。

插件执行顺序如下

![插件执行顺序](https://github.com/Cwd295645351/picx-images-hosting/raw/master/1750399761061.70almb6gho.webp)

而生产环境下，由于 Vite 直接使用 Rollup，Vite 插件中所有 Rollup 的插件钩子都会生效。

vite 插件编写时需要返回一个对象，对象包含了插件名称、插件执行时机和钩子函数。如下：

```js
{
  name: 'vite-aliases', // 插件名字
  enforce: 'pre', // 插件执行顺序
  config(config, { command }) { // vite 特有的 config 钩子，config 为默认配置，command 为命令
    gen = new Generator(command, options);
    gen.init(); // 调用 init，读取 root 目录，生成数组对象
    config.resolve = {
      alias: config.resolve?.alias  // 有alias就合并
        ? [
          ...toArray(config.resolve.alias as any),
          ...gen.aliases
        ]
        : gen.aliases, // 没有就直接用生成的alias
    };
  },
};
```

enfore 修饰符表示插件调用的时机：

- pre：在 Vite 核心插件之前调用该插件
- 默认：在 Vite 核心插件之后调用该插件
- post：在 Vite 构建插件之后调用该插件

Vite 独有的五个钩子

- **config**: 用来进一步修改配置。
- **configResolved**: 用来记录最终的配置信息。
- **configureServer**: 用来获取 Vite Dev Server 实例，添加中间件。
- **transformIndexHtml**: 用来转换 HTML 的内容。
- **handleHotUpdate**: 用来进行热更新模块的过滤，或者进行自定义的热更新处理。

### 1.config

Vite 在读取完配置文件（即 vite.config.ts ）之后，会拿到用户导出的配置对象，然后执行 config 钩子。在这个钩子里面，可以对配置文件导出的对象进行自定义的操作，如下代码所示:

```js
const mutateConfigPlugin = () => ({
  name: 'mutate-config', // command 为 `serve`(开发环境) 或者 `build`(生产环境)
  // 用法一
  config: () => ({
    alias: {
      react: require.resolve('react'),
    },
  }),
  // 用法二
  config(config, { command }) {
    // 生产环境中修改 root 参数
    if (command === 'build') {
      config.root = __dirname
    }
  },
  // 用法三
  config() {
    return {
      optimizeDeps: {
        esbuildOptions: {
          plugins: [],
        },
      },
    }
  },
})
```

### 2.configResolved

Vite 在解析完配置之后会调用 configResolved 钩子，这个钩子一般用来记录最终的配置信息，而不建议再修改配置，用法如下。

```js
const exmaplePlugin = () => {
  let config
  return {
    name: 'read-config',
    configResolved(resolvedConfig) {
      // 记录最终配置
      config = resolvedConfig
    }, // 在其他钩子中可以访问到配置
    transform(code, id) {
      console.log(config)
    },
  }
}
```

### 3.configureServer

这个钩子仅在开发阶段会被调用，用于扩展 Vite 的 Dev Server，一般用于增加自定义 server 中间件，如下代码：

```js
const myPlugin = () => ({
  name: 'configure-server',
  configureServer(server) {
    // 姿势 1: 在 Vite 内置中间件之前执行
    server.middlewares.use((req, res, next) => {
      // 自定义请求处理逻辑
    })
    // 姿势 2: 在 Vite 内置中间件之后执行
    return () => {
      server.middlewares.use((req, res, next) => {
        // 自定义请求处理逻辑
      })
    }
  },
})
```

### 4.transformIndexHtml

transformIndexHtml 钩子用来灵活控制 HTML 的内容，你可以拿到原始的 html 内容后进行任意的转换：

```js
const htmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      returnhtml.replace(/<title>(.*?)<\/title>/, `<title>换了个标题</title>`)
    },
  }
}
```

也可以返回如下的对象结构，一般用于添加某些标签

```js
import { UserConfig, IndexHtmlTransformHook } from 'vite'

const loadConfigPlugin = () => {
  let _mode: 'development' | 'production'
  return {
    name: 'load-config',
    config(config: UserConfig, env: { mode: 'development' | 'production' }) {
      _mode = mode
    },
    transformIndexHtml(html: IndexHtmlTransformHook) {
      const configSrc = _mode === 'development' ? './config.local.ts' : './config.ts'
      return {
        html,
        //注入标签
        tags: [
          {
            //放到body末尾，可取值还有`head`|`head-prepend`|`body-prepend`，顾名思义
            injectTo: 'body',
            //标签属性定义
            attrs: { type: 'module', src: configSrc },
            //标签名
            tag: 'script',
          },
        ],
      }
    },
  }
}

export { loadConfigPlugin }
```

### 5.handleHotUpdate

handleHotUpdate 钩子主要用在服务区热更新，这个钩子会在 Vite 服务端处理热更新时被调用，你可以在这个钩子中拿到热更新相关的上下文信息，进行热更模块的过滤，或者进行自定义的热更处理。

```js
const handleHmrPlugin = () => {
  return {
    async handleHotUpdate(ctx) {
      // 需要热更的文件
      console.log(ctx.file) // 需要热更的模块，如一个 Vue 单文件会涉及多个模块
      console.log(ctx.modules) // 时间戳
      console.log(ctx.timestamp) // Vite Dev Server 实例
      console.log(ctx.server) // 读取最新的文件内容
      console.log(await read()) // 自行处理 HMR 事件
      ctx.server.ws.send({
        type: 'custom',
        event: 'special-update',
        data: { a: 1 },
      })
      return []
    },
  }
}
```

前端代码中加入

```js
if (import.meta.hot) {
  import.meta.hot.on('special-update', (data) => {
    // 执行自定义更新
    // { a: 1 }
    console.log(data)
    window.location.reload()
  })
}
```

## 五、vite 命令行指令

`vite dev` 和 `vite serve` 是 `vite` 的别名，其额外选项如下：

| 选项                     |                                                                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `--host [host]`          | 指定主机名称 (`string`)                                                                                                |
| `--port <port>`          | 指定端口 (`number`)                                                                                                    |
| `--open [path]`          | 启动时打开浏览器 (`boolean / string`)                                                                                  |
| `--cors`                 | 启用 CORS (`boolean`)                                                                                                  |
| `--strictPort`           | 如果指定的端口已在使用中，则退出 (`boolean`)                                                                           |
| `--force`                | 强制优化器忽略缓存并重新构建 (`boolean`)                                                                               |
| `-c, --config <file>`    | 使用指定的配置文件 (`string`)                                                                                          |
| `--base <path>`          | 公共基础路径（默认为：`/`）(`string`)                                                                                  |
| `-l, --logLevel <level>` | info / warn / error / silent (`string`)                                                                                |
| `--clearScreen`          | 允许或禁用打印日志时清除屏幕 (`boolean`)                                                                               |
| `--profile`              | 启动内置的 Node.js 调试器（查看 [性能瓶颈](https://cn.vitejs.dev/guide/troubleshooting.html#performance-bottlenecks)） |
| `-d, --debug [feat]`     | 显示调试日志 (`string / boolean`)                                                                                      |
| `-f, --filter <filter>`  | 过滤调试日志 (`string`)                                                                                                |
| `-m, --mode <mode>`      | 设置环境模式 (`string`)                                                                                                |
| `-h, --help`             | 显示可用的 CLI 选项                                                                                                    |
| `-v, --version`          | 显示版本号                                                                                                             |

`vite build` 指令用于构建生产版本，其额外选项如下：

| **选项**                       |                                                                                                                        |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `--target <target>`            | 编译目标（默认为：`"modules"`）(`string`)                                                                              |
| `--outDir <dir>`               | 输出目录（默认为：`dist`）(`string`)                                                                                   |
| `--assetsDir <dir>`            | 在输出目录下放置资源的目录（默认为：`"assets"`）(`string`)                                                             |
| `--assetsInlineLimit <number>` | 静态资源内联为 base64 编码的阈值，以字节为单位（默认为：`4096`）(`number`)                                             |
| `--ssr [entry]`                | 为服务端渲染配置指定入口文件 (`string`)                                                                                |
| `--sourcemap [output]`         | 构建后输出 source map 文件（默认为：`false`）(`boolean / "inline" / "hidden"`)                                         |
| `--minify [minifier]`          | 允许或禁用最小化混淆，或指定使用哪种混淆器（默认为：`"esbuild"`）(`boolean / "terser" / "esbuild"`)                    |
| `--manifest [name]`            | 构建后生成 manifest.json 文件 (`boolean / string`)                                                                     |
| `--ssrManifest [name]`         | 构建后生成 SSR manifest.json 文件 (`boolean / string`)                                                                 |
| `--emptyOutDir`                | 若输出目录在根目录外，强制清空输出目录 (`boolean`)                                                                     |
| `-w, --watch`                  | 在磁盘中模块发生变化时，重新构建 (`boolean`)                                                                           |
| `-c, --config <file>`          | 使用指定的配置文件 (`string`)                                                                                          |
| `--base <path>`                | 公共基础路径（默认为：`/`）(`string`)                                                                                  |
| `-l, --logLevel <level>`       | Info / warn / error / silent (`string`)                                                                                |
| `--clearScreen`                | 允许或禁用打印日志时清除屏幕 (`boolean`)                                                                               |
| `--profile`                    | 启动内置的 Node.js 调试器（查看 [性能瓶颈](https://cn.vitejs.dev/guide/troubleshooting.html#performance-bottlenecks)） |
| `-d, --debug [feat]`           | 显示调试日志 (`string / boolean`)                                                                                      |
| `-f, --filter <filter>`        | 过滤调试日志 (`string`)                                                                                                |
| `-m, --mode <mode>`            | 设置环境模式 (`string`)                                                                                                |
| `-h, --help`                   | 显示可用的 CLI 选项                                                                                                    |

`vite optimize` 指令用于依赖预构建，其额外选项如下：

| **选项**                 |                                          |
| ------------------------ | ---------------------------------------- |
| `--force`                | 强制优化器忽略缓存并重新构建 (`boolean`) |
| `-c, --config <file>`    | 使用指定的配置文件 (`string`)            |
| `--base <path>`          | 公共基础路径（默认为：`/`）(`string`)    |
| `-l, --logLevel <level>` | Info / warn / error / silent (`string`)  |
| `--clearScreen`          | 允许或禁用打印日志时清除屏幕 (`boolean`) |
| `-d, --debug [feat]`     | 显示调试日志 (`string / boolean`)        |
| `-f, --filter <filter>`  | 过滤调试日志 (`string`)                  |
| `-m, --mode <mode>`      | 设置环境模式 (`string`)                  |
| `-h, --help`             | 显示可用的 CLI 选项                      |

`vite preview` 用于本地预览构建产物，不可用于生产环境，其额外配置如下：

| **选项**                 |                                              |
| ------------------------ | -------------------------------------------- |
| `--host [host]`          | 指定主机名称 (`string`)                      |
| `--port <port>`          | 指定端口 (`number`)                          |
| `--strictPort`           | 如果指定的端口已在使用中，则退出 (`boolean`) |
| `--open [path]`          | 启动时打开浏览器 (`boolean / string`)        |
| `--outDir <dir>`         | 输出目录（默认为：`dist`)(`string`)          |
| `-c, --config <file>`    | 使用指定的配置文件 (`string`)                |
| `--base <path>`          | 公共基础路径（默认为：`/`）(`string`)        |
| `-l, --logLevel <level>` | Info / warn / error / silent (`string`)      |
| `--clearScreen`          | 允许或禁用打印日志时清除屏幕 (`boolean`)     |
| `-d, --debug [feat]`     | 显示调试日志 (`string / boolean`)            |
| `-f, --filter <filter>`  | 过滤调试日志 (`string`)                      |
| `-m, --mode <mode>`      | 设置环境模式 (`string`)                      |
| `-h, --help`             | 显示可用的 CLI 选项                          |
