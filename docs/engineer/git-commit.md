# Git 提交信息指南

在日常的代码开发中，规范化的提交信息是非常重要的，它能够帮助团队更好地理解和管理代码变更历史。本文将介绍如何利用 `Angular` 提交规范、`commitizen`、`commitlint` 和 `husky` 来规范化提交信息，以及如何定制自定义提交格式。

## 一、[Angular 提交规范](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit?pli=1#heading=h.4e0o8t4fffjf)

Angular 提交规范是一种约定俗成的提交信息格式，将提交信息分为类型、范围和简短描述三个部分，格式如下：  
[](url)

```plain
<类型>(<范围>): <简短描述>
```

- <类型>: 用于描述提交的性质，常见类型有：
  - feat: 新功能
  - fix: 修复 bug
  - docs: 文档变更
  - style: 代码样式变更
  - refactor: 重构代码
  - test: 测试相关
  - chore: 其他杂项
- <范围>: 描述提交所涉及的范围，可以是任何与提交相关的内容，通常是文件名或模块名。
- <简短描述>: 对提交的简要描述，清晰明了。

例如：

```plain
feat(login): add new login feature
fix(api): fix issue with API request
docs(readme): update installation instructions
```

常见的提交类型包括 `feat`、`fix`、`docs`、`style`、`refactor`、`test` 和 `chore`。

## 二、commitizen 介绍和使用

`commitizen` 是一个用于规范化提交信息的工具，它能够引导用户按照规范填写提交信息，并生成符合规范的提交信息模板。通过命令行界面交互的方式，`commitizen` 可以帮助用户选择提交类型、范围和描述信息，并以规范的格式生成提交信息。

使用 `commitizen` 可以避免用户忘记填写关键信息，提高提交信息的一致性和可读性。安装 `commitizen` 后，可以通过运行 `git cz` 来代替 `git commit` 进行提交。

- 安装依赖：

```bash
npm i -D commitizen cz-conventional-changelog
```

- 修改 `package.json`：

```json
{
  "script": {
    "commit": "git-cz"
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-conventional-changelog"
    }
  }
}
```

使用上述两种方式配置好 `commitizen`，就能使用 `git-cz` 或 `npm run commit` 代替 `git commit` 了，依次完成所有步骤就能规范地提交了。

![提交提示](https://cdn.jsdelivr.net/gh/Cwd295645351/picx-images-hosting@master/block/image.6pngnmfwen.webp)

若觉得英文看不懂的话，可以将 `cz-conventional-changelog` 替换成中文版 `cz-conventional-changelog-zh`，此时运行 `npm run commit` 就能得到中文版提示:

![中文提示](https://cdn.jsdelivr.net/gh/Cwd295645351/picx-images-hosting@master/block/image.32hx03klmy.webp)

或者通过以下命令一键初始化：

```bash
npx commitizen init cz-conventional-changelog --save --save-exact
```

## 三、cz-customizable 自定义提交格式

若现有的提交文案不符合项目要求，我们也可以使用 `cz-customizable` 这个 `commitizen` 的定制化工具来制定一份项目特有的提交格式，并在提交时生成符合规范的提交信息模板。

接下来演示一下如何使用 `cz-customizable` 来定义自定义的提交格式，并集成到项目中

- 安装依赖：

```bash
npm i commitizen cz-customizable -D
```

- 配置 `.cz-config.js`：

```javascript
// 根目录下的 .cz-config.js
// https://github.com/leoforfree/cz-customizable/blob/master/cz-config-EXAMPLE.js
module.exports = {
  // 对原有的 types 进行汉化处理
  types: [
    { value: '特性', name: '特性:    一个新的特性' },
    { value: '修复', name: '修复:    修复一个Bug' },
    { value: '文档', name: '文档:    变更的只有文档' },
    { value: '格式', name: '格式:    空格, 分号等格式修复' },
    { value: '重构', name: '重构:    代码重构，注意和特性、修复区分开' },
    { value: '性能', name: '性能:    提升性能' },
    { value: '测试', name: '测试:    添加一个测试' },
    { value: '工具', name: '工具:    开发工具变动(构建、脚手架工具等)' },
    { value: '回滚', name: '回滚:    代码回退' },
    { value: '开发中', name: '开发中:  功能正在开发，还未完成' },
  ],

  // 以本小册的课程内容进行 scopes 的拆分
  // 如果是组件库，则可以根据组件的名称进行拆分
  // 如果是框架库，也可以根据框架库的模块内容进行拆分
  // 例如这里的框架设计还可以细分为 框架设计(沙箱)、框架设计(性能优化)、框架设计(通信)
  scopes: [{ name: '方案了解' }, { name: '框架原理' }, { name: '工程设计' }, { name: '框架设计' }],

  usePreparedCommit: false, // to re-use commit from ./.git/COMMIT_EDITMSG
  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: 'TICKET-',
  ticketNumberRegExp: '\\d{1,5}',

  // it needs to match the value for field type. Eg.: 'fix'
  /*
    scopeOverrides: {
      fix: [
  
        {name: 'merge'},
        {name: 'style'},
        {name: 'e2eTest'},
        {name: 'unitTest'}
      ]
    },
    */
  // override the messages, defaults are as follows
  messages: {
    type: '选择一种提交类型:',
    scope: '选择一个 scope (可选):',
    // used if allowCustomScopes is true
    customScope: '选择一个 scope:',
    subject: '短说明:\n',
    body: '长说明，使用"|"换行(可选)：\n',
    breaking: '非兼容性说明 (可选):\n',
    footer: '关联关闭的 issue，例如：#31, #34(可选):\n',
    confirmCommit: '确定提交说明?',
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  // skip any questions you want
  // skipQuestions: ['scope', 'body'],

  // limit subject length
  subjectLimit: 100,
  // breaklineChar: '|', // It is supported for fields body and footer.
  // footerPrefix : 'ISSUES CLOSED:'
  // askForBreakingChangeFirst : true, // default is false
}
```

- 修改 package.json 文件

```json
{
  "scripts": {
    "commit": "git-cz"
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-customizable"
    }
  }
}
```

直接运行 `npm run commit` 即可选择对应提交内容

![自定义提交信息](https://cdn.jsdelivr.net/gh/Cwd295645351/picx-images-hosting@master/block/image.3nrkmey7v3.webp)

或者通过以下命令一键初始化，`--force` 参数是为了强制覆盖适配器。

```bash
npx commitizen init cz-customizable --save --save-exact --force
```

## 四、commitlint 和 husky 的介绍和使用

尽管我们设置了提交规范，但是并不能阻止团队成员直接通过 `git commit` 去提交不符合规范的内容。为了避免这种情况，我们需要引入 `commitlint` 和 `husky` 来规范化提交。

- **commitlint**

`commitlint` 是一个用于校验提交信息的工具，它能够根据预定义的规则对提交信息进行校验，确保提交信息的格式正确。

- **husky**

`husky` 能够在提交前、推送前等阶段执行自定义脚本，帮助我们实现提交信息的自动校验。

结合 husky 和 commitlint，可以在提交时自动触发提交信息的校验。步骤如下：

- 安装依赖：

```bash
npm install @commitlint/config-conventional @commitlint/cli husky -D
```

- 配置 `commitlint.config.js`：

```javascript
module.exports = { extends: ['@commitlint/config-conventional'] }
```

- 配置 `husky`：

执行 `npx husky install` 命令，完成 `husky` 的初始化。

```bash
npx husky install
```

此时项目根目录会生成 `.husky` 目录，目录内容如下

![husky 目录](https://cdn.jsdelivr.net/gh/Cwd295645351/picx-images-hosting@master/block/image.sywgm1ntw.webp)

接着修改 `.husky/_/commit-msg` 文件，内容如下：

```bash
#!/usr/bin/env sh

. "${0%/*}/husky.sh"

npx --no -- commitlint -e $HUSKY_GIT_PARAMS
```

通过以上步骤，你可以规范化提交信息并自定义提交格式，同时通过 commitlint 和 husky 实现提交信息的自动校验。，若提交信息不规范则不允许提交。

![格式不正确提交失败](https://cdn.jsdelivr.net/gh/Cwd295645351/picx-images-hosting@master/block/image.3uushu38rs.webp)

提交正确的格式则能正常提交。

![格式正确提交](https://cdn.jsdelivr.net/gh/Cwd295645351/picx-images-hosting@master/block/image.esgpqtu57.webp)

若使用自定义提交格式的话，则需要安装依赖 `commitlint-config-cz`，并修改 `commit.config.js`文件：

```javascript
module.exports = { extends: ['cz'] }
```

## 五、lint-staged

使用 `lint-staged`可以在提交代码之前使用 [**eslint**](https://www.yuque.com/wurenshenghuan-uqxjl/ps4q75/vd2tilw8ck12wt6b) 进行检查，首先安装依赖：

```bash
npm i lint-staged -D
```

接着在项目根目录下创建 `.lintstagedrc.js` 配置文件，文件内容如下：

```javascript
module.exports = {
  // 注意和 package.json 中的 {  "lint": "eslint --ext .ts src" } 保持一致
  'src/**/*.ts': 'eslint',
}
```

最后修改 `.husky/pre-commit`文件：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# npm run lint
npx lint-staged
```

至此，在用户提交内容时会先进行 eslint 检查，检查通过才允许提交：

![eslint 检查通过](https://cdn.jsdelivr.net/gh/Cwd295645351/picx-images-hosting@master/block/image.969p2jpv5n.webp)

不通过则会报错：

![eslint 检查不通过](https://cdn.jsdelivr.net/gh/Cwd295645351/picx-images-hosting@master/block/image.4uavv072ac.webp)

## 六、生成 changelog 日志

安装依赖 `conventional-changelog-cli`，接着添加 script 脚本：

```json
{
  "scripts": {
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0"
  }
}
```

接着运行 `npm run changelog` 即可生成日志：

![image](https://cdn.jsdelivr.net/gh/Cwd295645351/picx-images-hosting@master/block/image.64dt1cf9rv.webp)

## 总结

规范化的提交信息能够帮助团队更好地管理代码变更历史，提高协作效率。通过使用 `Angular` 提交规范、`commitizen`、`commitlint` 和 `husky`，我们能够轻松地规范化提交信息，并确保提交信息的格式正确。在实际的项目开发中，建议团队成员养成良好的提交信息习惯，以便更好地追溯和管理代码变更。

## 参考资料

- [https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit?pli=1#heading=h.4e0o8t4fffjf](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit?pli=1#heading=h.4e0o8t4fffjf) 【Angular 提交规范】
