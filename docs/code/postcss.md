# postcss px2vw 配置

```js
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 1920,
      unitPrecision: 3,
      propList: ['*'],
      viewportUnit: 'vw',
      fontViewportUnit: 'vw',
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: false,
      replace: true,
    },
  },
}
```
