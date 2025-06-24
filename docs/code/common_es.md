# cjs、ES 获取文件路径

## common

```js
const path = require('node:path')

const filePath = __filename

console.log(filePath)
console.log(path.dirname(filePath))
console.log(path.basename(filePath))
console.log(path.extname(filePath))
```

这里用 `__filename` 拿到当前文件路径，然后用 `dirname`、`basename`、`extname` 拿到目录名、文件名、后缀名。

## ES

```js
import path from 'node:path';
import { fileURLToPath } from 'node:url'

// __filename 不能直接使用，需要转换
const filePath = fileURLToPath(import.meta.url)

console.log(filePath)
console.log(path.dirname(filePath));
console.log(path.basename(filePath));
console.log(path.extname(filePath));
```