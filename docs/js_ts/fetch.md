# Fetch 使用

## 一、常见使用方法

`fetch()` 方法使用 Promise，我们可以通过 `then()` 方法去获得请求的响应，而当网络错误时可以通过 `catch()` 捕获。

`fetch()` 请求返回一个 Stream 对象，我们可以通过 `response.json()` 方法将接口响应数据转成 JSON 对象。

```js
fetch('/api/messagecenter/manager/v1/route/ceshi')
  .then((response = response.json()))
  .then((data = console.log(data)))
  .catch((err = console.log('请求失败，', err)))
```

### 1.GET 请求

`fetch()` 默认就是 GET 请求。我们可以使用 await 语法编写同步代码。

```js
const getData = async () = {
  try {
    const response = await fetch('/api/messagecenter/manager/v1/route/ceshi?name=liming&age=18')
    return response.json()
  } catch (err) {
    console.log('请求失败，', err)
  }
}
```

### 2.POST 请求

我们常用的 POST 请求格式分为 `json`、`formData` 和 `x-www-form-urlencoded`。

`json` 格式请求如下：

```js
const data = { name: 'liming', age: 18 }

const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  body: JSON.stringify(data),
})
```

`formData` 格式请求如下：

```js
const input = document.querySelector('input[type="file"]')
const data = new FormData()
data.append('file', input.files[0])
data.append('timestamp', Date.now())
data.append('name', 'liming')

const response = await fetch(url, {
  method: 'POST',
  body: data,
})
```

`x-www-form-urlencoded` 格式请求如下：

```js
const data = { name: 'liming', age: 18 }

const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  body: JSON.stringify(data),
```

## 二、fetch() 配置

### 1.Request 参数配置

`fetch` 语法如下：

```js
fetch(resource)
fetch(resource, options)
```

`fetch()` 请求的底层用的是 `Request()` 对象的接口， `options` [参数配置](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)如下：

```ts
interface Options {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'
  headers: Headers
  body: string | FormData | Blob | ArrayBuffer | DataView | File | TypedArray | URLSearchParams
  mode: 'cors' | 'same-origin' | 'no-cors' | 'navigate' | 'websocket'
  cache: 'default' | 'no-cache' | 'no-store' | 'reload' | 'force-cache' | 'only-if-cached'
  credentials: 'same-origin' | 'omit' | 'include'
  redirect: 'follow' | 'manual' | 'error'
  keepalive: boolean
  signal: AbortSignal
}
```

以上属性中，`method` 已经给过示例了，接下来是各个参数属性的介绍。

#### （1）headers

`headers` 对象用于配置请求头，我们可以通过 `Headers()` 构造函数来创建 headers 对象，它由零个或多个键值对组成，示例如下：

```js
const headers1 = new Headers()
headers1.append('Content-Type', 'application/json; charset=utf-8')
headers1.append('Content-Length', 782)
headers1.append('X-Custom-Header', 'CustomHeader')

const headers2 = new Headers({
  'Content-Type': 'application/json; charset=utf-8',
  'Content-Length': 782,
  'X-Custom-Header': 'CustomHeader',
})
```

我们也可以获取 headers 的内容，但是如果获取了一个不合法的属性或者设置了一个不可写的属性时，会抛出异常 TypeError 异常。

```js
const headers = new Headers({
  'Content-Type': 'application/json; charset=utf-8',
  'Content-Length': 782,
  'X-Custom-Header': 'CustomHeader',
})

console.log(headers.has('Content-Type')) // true
console.log(headers.has('Set-Cookie')) // false

headers.set('Content-Type', 'text/html')
headers.append('X-Custom-Header', 'test')

console.log(headers.get('X-Custom-Header')) // CustomHeader, test

headers.delete('X-Custom-Header')
console.log(headers.get('X-Custom-Header')) // null
```

#### （2）body

body 是用来存放要发送的数据，如下：

```js
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  },
  body: 'name=liming&age=18',
})

const jsonData = response.json()
```

当我们要传输 JSON 对象时，需要调用 `JSON.stringify()` 方法转化 JSON 数据，并设置 `Content-Type` 为 `application/json;charset=utf-8`。

```js
const data = { name: 'liming', age: 18 }

const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  body: JSON.stringify(data),
})
```

若要传输文件，则可以通过 `FormData` 进行传输。

```js
const input = document.querySelector('input[type="file"]')
const data = new FormData()
data.append('file', input.files[0])
data.append('timestamp', Date.now())
data.append('name', 'liming')

const response = await fetch(url, {
  method: 'POST',
  body: data,
})
```

当我们要传输二进制数据时，可以将 Blob 数据放到 `body` 属性中。

```js
let blob = await new Promise((resolve = canvasElem.toBlob(resolve, 'image/png')))

let response = await fetch('/article/fetch/post/image', {
  method: 'POST',
  body: blob,
})
```

#### （3）mode

`mode` 属性用于设置请求的默认，取值如下：

- cors：默认值，允许跨域
- same-origin：只允许同域请求
- no-cors：请求方法只限于 `GET`、`POST` 和 `HEAD`，并且只能使用有限的几个简单标头，不能添加跨域的复杂标头，相当于提交表单所能发出的请求
- navigate：仅用于 HTML 导航
- websocket：仅在建立 WebSocket 连接时使用

#### （4）cache

`cache` 属性指定如何处理缓存，取值如下：

- default：默认值，先在缓存中查找匹配的响应。
  1.  若存在匹配项且未过期，则返回匹配项；
  2.  若存在匹配项但已过期，则向服务器发出请求，若服务器表示资源未更新，则返回匹配项，否则从服务器获取数据并更新该缓存；
  3.  不存在匹配项，浏览器发出请求，并更新缓存。
- no-cache：将服务器的资源与本地缓存进行比较，有更新则使用服务器资源并更新缓存，否则直接使用缓存。
- no-store：直接从服务器获取数据，且不更新缓存
- reload：直接请求服务器数据，并更新缓存
- force-cache：缓存优先。当缓存不存在时则请求服务器资源并更新缓存
- only-if-cached：只获取缓存数据，若缓存无数据则返回网络错误。（只有 `mode` 属性为 `same-origin` 时才能使用）

#### （5）credentials

`credentials` 属性控制浏览器在发送请求时是否携带凭据，凭据包括 `Cookie`、证书和包含用户名和密码的身份验证标头。该选项取值如下：

- same-origin：默认值，同域时发送，跨域时不发送。
- include：不管是否跨域都发送凭据。当设置为 `include` 时，服务器响应需要包含 `Access-Control-Allow-Credentials`，且 `Access-Control-Allow-Origin`相应头需要显示指定客户端来源，不允许使用 `*`
- omit：不管是否跨域都不发送凭据。

#### （6）redirect

`redirect` 属性决定服务器返回重定向后的行为，取值如下：

- follow：默认值，自动重定向
- manual：不进行重定向，由用户自行决定接下来的行为，此时 `response.url` 属性指向新的 URL
- error：若发生重定向责报错

#### （7）keepalive

默认为 `false`。设置为 `true` 时，在请求未完成之前页面已关闭的情况下，浏览器不会中断该请求。

#### （8）signal

`signal` 属性用于取消请求，需要传入 AbortController 对象，并通过 AbortController 对象去中断接口请求，使用方法如下：

```js
const controller = new AbortController()
const signal = controller.signal

fetch(url, {
  signal: controller.signal,
})

signal.addEventListener('abort', () = console.log('取消请求'))

console.log(signal.aborted) // false

// 取消请求
controller.abort()

console.log(signal.aborted) // true
```

### 2.Response 参数配置

`fetch` 请求回返回一个 `Response` 对象，它存在以下属性和方法：

#### （1）Response 属性

- Response.headers

包含了 Response 对象所关联的 [Headers](https://developer.mozilla.org/zh-CN/docs/Web/API/Headers) 对象

- Response.ok

`Response.ok` 属性返回一个布尔值，表示请求是否成功，true 对应 HTTP 请求的状态码的范围在 200-299。

- Response.status

`Response.status` 属性返回一个数字，即该请求的状态码，如 200。

- Response.statusText

`Response.statusText` 属性返回一个字符串，表示该请求的状态信息，如状态码 200 对应的信息是 OK

- Response.url

`Response.url` 属性返回一个字符串，表示该请求的地址，若发生重定向，则返回重定向后的地址

- Response.redirected

`Response.redirected` 属性返回一个布尔值，表示该请求是否经过重定向，

- Response.type

`Response.type` 属性返回请求的类型，可能取值如下：

- basic：同源响应。
- cors：跨域请求。
- error：网络错误，主要用于 Service Worker。
- opaque：当请求配置 `mode` 设置为 `no-core` 时，返回该值。
- opaqueredirect：当请求配置 `redirect` 设置为 `manual` 时，返回该值

- Response.body

`Response.body` 属性返回一个 `ReadableStream` 对象，它可以用来分块读取内容。

通过 `getReader()` 方法得到一个 reader，调用 reader 对象的 `read()` 方法去读取响应流中的数据。

`read` 方法返回两个参数 `done` 和 `value`，`done` 属性表示是否读取完毕，`value` 属性是一个 arrayBuffer 数组，表示读取到的内容块的内容。

```js
const response = await fetch('flower.jpg')
const reader = response.body.getReader()

while (true) {
  const { done, value } = await reader.read()
  if (done) {
    break
  }
  console.log(`Received ${value.length} bytes`)
}
```

- Response.bodyUsed

`Response.bodyUsed` 属性表示 body 是否被使用过，目前还是一项实验性技术。

#### （2）Response 方法

`Response` 对象根据服务器返回的数据，提供不同的方法：

- Response.json()：返回 JSON 对象。
- Response.text()：返回文本字符串，例如 HTML 文件。
- Response.blob()：返回 Blob 对象，用于获取二进制文件。
- Response.formData()：返回 FormData 对象。
- Response.arrayBuffer()：返回 ArrayBuffer 对象，主要用于获取流媒体文件。

以上方法都是异步的，返回的都是 Promise 对象。

Response 对象只能读取一次，当调用 `json()` 方法后，流已经没有内容了，此时再次调用该方法会报错。

```js
const json1 = await response.json()
const json2 = await response.json() // TypeError: Failed to execute 'json' on 'Response': body stream already read
```

Response 对象提供 `Response.clone()` 方法来创建副本，实现多次读取的功能。

```js
const image1 = document.querySelector('.img1')
const image2 = document.querySelector('.img2')

const myRequest = new Request('flowers.jpg')

fetch(myRequest).then((response) = {
  const response2 = response.clone()

  response.blob().then((myBlob) = {
    const objectURL = URL.createObjectURL(myBlob)
    image1.src = objectURL
  })

  response2.blob().then((myBlob) = {
    const objectURL = URL.createObjectURL(myBlob)
    image2.src = objectURL
  })
})
```

上面的例子中，我们在请求返回时，通过 `response.clone` 方法克隆响应，并将结果赋给两个不同的 img 元素。

## 总结

`fetch()` 方法能让我们不使用任何依赖去请求数据，支持分块读取数据，提高网站性能表现，但是它是不兼容 IE 浏览器的。相比于 `axios`，它无法获取文件上传的进度，也无法直接设置接口请求过期时间。在无法下载依赖的场景下，使用 `fetch()` 方法要比使用 `XMLHttpRequest` 更加便捷，使得代码更加简洁。

## 参考链接

https://www.ruanyifeng.com/blog/2020/12/fetch-tutorial.html
https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch
https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
https://developer.mozilla.org/zh-CN/docs/Web/API/Headers
