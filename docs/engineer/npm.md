# npm 发布流程

在发布 NPM 包之前，需要在官方网站进行注册 ，接着就能通过命令行去登录了。

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
