# ESlint 配置

中文文档：[https://eslint.nodejs.cn/](https://eslint.nodejs.cn/)

## 一、快速安装

使用命令 `npm init @eslint/config` 快速安装并配置 ESLint

```bash
npm init @eslint/config
```

## 二、手动安装

- 安装 ESLint 包：

```bash
npm install --save-dev eslint @eslint/js
```

- 添加 `eslint.config.js`文件，并添加如下配置：

```javascript
import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
    },
  },
]
```

## 三、配置对象

### files

`files` - 指示配置对象应应用于的文件的通配符模式数组。如果未指定，则配置对象适用于与任何其他配置对象匹配的所有文件

```javascript
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
  },
]
```

没有扩展名的文件可以与模式 `!(*.*)` 匹配。例如：

```javascript
export default [
  {
    files: ['**/!(*.*)'],
  },
  // ...other config
]
```

### ignores

`ignores`- 指示配置对象不应应用于的文件的通配符模式数组。如果未指定，则配置对象适用于 `files` 匹配的所有文件。如果在配置对象中使用 `ignores` 而没有任何其他键，则模式将充当 [全局忽略](https://eslint.nodejs.cn/docs/latest/use/configure/configuration-files#globally-ignoring-files-with-ignores)。

```javascript
export default [
  {
    files: ['src/**/*.js'],
    // 配置对象不包括以 .config.js 结尾的文件，但 eslint.config.js 除外。该文件仍然应用了 semi。
    ignores: ['**/*.config.js', '!**/eslint.config.js'],
    rules: {
      semi: 'error',
    },
  },
]
```

### languageOptions

`languageOptions` - 包含与如何为代码检查配置 JavaScript 相关的设置的对象。

- `ecmaVersion` - 支持的 ECMAScript 版本。可以是任何年份（即 `2022`）或版本（即 `5`）。对于最新支持的版本，设置为 `"latest"`。（默认：`"latest"`）
- `sourceType` - JavaScript 源代码的类型。可能的值是 `"script"` 用于传统脚本文件，`"module"` 用于 ECMAScript 模块 (ESM) 和 `"commonjs"` 用于 CommonJS 文件。（默认：`"module"` 用于 `.js` 和 `.mjs` 文件；`"commonjs"` 用于 `.cjs` 文件）
- `globals` - 指定在代码检查期间应添加到全局作用域的其他对象的对象。
- `parser` - 包含 `parse()` 方法或 `parseForESLint()` 方法的对象。（默认：[espree](https://github.com/eslint/espree)）
- `parserOptions` - 指定直接传递给解析器上的 `parse()` 或 `parseForESLint()` 方法的其他选项的对象。可用选项取决于解析器。

```javascript
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
]
```

### linterOptions

`linterOptions` - 包含与代码检查过程相关的设置的对象。

- `noInlineConfig` - 一个布尔值，指示是否允许内联配置。
- `reportUnusedDisableDirectives` - 一个严重性字符串，指示是否以及如何应跟踪和报告未使用的禁用和启用指令。对于旧版兼容性，`true` 相当于 `"warn"`，`false` 相当于 `"off"`。（默认值：`"warn"`）。

### processor

`processor` - 包含 `preprocess()` 和 `postprocess()` 方法的对象或指示插件内处理器名称的字符串（即 `"pluginName/processorName"`）。

```javascript
import markdown from 'eslint-plugin-markdown'

export default [
  // applies to all JavaScript files
  {
    rules: {
      strict: 'error',
    },
  },

  {
    files: ['**/*.md'],
    plugins: {
      markdown,
    },
    processor: 'markdown/markdown',
  },
]
```

以上配置表示使用 `eslint-plugin-markdown` 中的处理器处理 `*.md` 文件

### plugins

`plugins` - 包含插件名称到插件对象的名称-值映射的对象。指定 `files` 时，这些插件仅对匹配的文件可用。

```javascript
import example from 'eslint-plugin-example'

export default [
  {
    plugins: {
      example,
    },
    rules: {
      'example/rule1': 'warn',
    },
  },
]
```

若需要直接从文件加载插件，代码如下。这里使用了命名空间  `local`，但你也可以使用任何你想要的名称。

```javascript
import local from './my-local-plugin.js'

export default [
  {
    plugins: {
      local,
    },
    rules: {
      'local/rule1': 'warn',
    },
  },
]
```

### rules

`rules` - 包含配置规则的对象。当指定 `files` 或 `ignores` 时，这些规则配置只对匹配的文件可用。

### settings

`settings` - 一个包含名称-值对信息的对象，所有规则都应使用这些信息。

## 四、使用预定义配置

<font style="color:#262626;">ESLint 有两个预定义的 JavaScript 配置：</font>

- `<font style="color:#262626;">js.configs.recommended</font>`<font style="color:#262626;"> </font><font style="color:#262626;">- 启用 ESLint 建议每个人使用的规则，以避免潜在的错误</font>
- `<font style="color:#262626;">js.configs.all</font>`<font style="color:#262626;"> </font><font style="color:#262626;">- 启用 ESLint 附带的所有规则</font>

<font style="color:#262626;">要包含这些预定义配置，请安装 </font>`<font style="color:#262626;">@eslint/js</font>`<font style="color:#262626;"> 包，然后对后续配置对象中的其他属性进行任何修改：</font>

```javascript
import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'warn',
    },
  },
]
```

若要支持 `ts` 文件，可以安装 `typescript-eslint`，若要支持 `vue` 文件，可以安装 `eslint-plugin-vue`，后续配置如下：

```javascript
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

export default [js.configs.recommended, ...tseslint.configs.recommended, ...pluginVue.configs['flat/essential']]
```
