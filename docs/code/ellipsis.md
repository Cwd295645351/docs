# 文本超出省略

```css
// 单行文本
.box {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// 多行文本
.ellipsis-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  white-space: break-spaces;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
```
