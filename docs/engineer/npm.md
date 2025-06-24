# npm 发布流程

## 一、直接发布

在发布 NPM 包之前，需要在官方网站进行[注册](https://www.npmjs.com/signup) ，接着就能通过命令行去登录了。

在命令行登录时，需要设置 npm 官方地址 `npm config set registry https://registry.npmjs.org/`
接着就能键入 `npm login` 进入以下登录流程：

```bash
npm login
npm WARN adduser `adduser` will be split into `login` and `register` in a future version. `adduser` will become an alias of `register`. `login` (currently an alias) will become its own command.
npm notice Log in on https://registry.npmjs.org/
Username: chen_wade
Password:
Email: (this IS public) qq@qq.com
npm notice Please check your email for a one-time password (OTP)
Enter one-time password: 48301822
Logged in as chen_wade on https://registry.npmjs.org/.
```

接下来就能通过 npm publish 命令进行发布

## 二、通过 changeset 发布

安装 `changeset`，执行 `changeset init`：

```bash
pnpm add --save-dev -w @changesets/cli prettier-plugin-organize-imports prettier-plugin-packagejson

npx changeset init
```

此时项目目录会多出一个 `.changeset` 目录：

![changeset 初始化](https://github.com/Cwd295645351/picx-images-hosting/raw/master/Snipaste_2025-06-20_14-21-39.7snh423ihu.webp)

`changeset` 基于 `git` 来判断代码有没有变动，它会根据上次的 `commit` 来判断变更， `commit` 提交后，创建一次变更：

```bash
npx changeset add
```

执行命令后，在 `.changeset` 下多了一个临时文件记录着这次变更的信息。

![单次变更](https://github.com/Cwd295645351/picx-images-hosting/raw/master/Snipaste_2025-06-20_14-21-58.4g4r9omy5f.webp)

然后执行 `version` 命令来生成最终的 `CHANGELOG.md` 还有更新版本信息：

```bash
npx changeset version
```

![changelog信息](https://github.com/Cwd295645351/picx-images-hosting/raw/master/Snipaste_2025-06-20_14-22-17.73u7k1fzhg.webp)

通过 `publish` 命令发布到 `npm` 仓库：

```bash
git add .
git commit -m 'second commit'

npx changeset publish
```
