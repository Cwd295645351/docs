# vue Diff 算法

当新旧 vnode 的子节点都是一组节点时，为了以最小的性能开销完成更新操作，需要比较两组子节点，用于比较的算法就叫作 Diff 算法

`key` 属性就像虚拟节点的“身份证”号，只要两个虚拟节点的 type 属性值和 key 属性值都相同，那么我们就认为它们是相同的，即可以进行 DOM 的复用

如果没有 key，我们无法知道新子节点与旧子节点间的映射关系，也就无法知道应该如何移动节点。有 key 的话情况则不同，我们根据子节点的 key 属性，能够明确知道新子节点在旧子节点中的位置，这样就可以进行相应的 DOM 移动操作了。

我们使用了两层 for 循环，外层循环用于遍历新的一组子节点，内层循环则遍历旧的一组子节点。在内层循环中，我们逐个对比新旧子节点的 key 值，试图在旧的子节点中找到可复用的节点。一旦找到，则调用 `patch` 函数进行打补丁。经过这一步操作之后，我们能够保证所有可复用的节点本身都已经更新完毕了。

在 patch 函数结束后，节点内容都已更新，接下来需要移动节点位置。

## 一、简单 Diff 算法

首先遍历新 children 数组，遍历数组时，通过每一项的 key，找到旧 children 中拥有相同 key 的元素。

若存在相同 key 的元素，则对这两个元素进行 patch 操作，使得真实 dom 的内容与当前新 children 中的元素内容保持一致。

虽然此时已完成更新内容操作，但是节点的顺序还保持原样，因此我们接下来要对 dom 元素进行移动。

在旧 children 中寻找具有相同 key 值节点的过程中，遇到的最大索引值。如果在后续寻找的过程中，存在索引值比当前遇到的最大索引值还要小的节点，则意味着该节点需要移动。

移动过程如下：

1. 定义全局变量 **lastIndex**，记录当前遍历过程中最大的**索引值**。

2. 通过 key 找到旧 children 中的节点，比较该节点的索引值与 lastIndex 的大小，若该索引值比 lastIndex 大，则此节点无需移动，此时更新 lastIndex 的值为当前索引值。若该索引值比 lastIndex 小，则此节点需要移动到上一个新 children 节点的后面，若上一个节点不存在，则表示当前节点为第一个节点。

新 children 遍历结束后，遍历旧 children，找到其中不存在于新 children 的节点，并将其卸载。

## 二、双端 Diff 算法

为新 children 和旧 children 设置四个指针 **newStartIndex** 、**newEndIndex**、**oldStartIndex** 和 **oldEndIndex** ，分别指向新旧 children 的头节点和尾节点。

接着进入 while 循环，循环退出条件是 **newStartIndex ＞ newEndIndex** 或者 o**ldStartIndex ＞ oldEndIndex** 指针。

循环步骤如下：

1. oldStartIndex 与 newStartIndex 指针比较。

若两者的 key 相同，则只需要 patch 打补丁更新内容即可。

oldStartIndex++，newStartIndex++

2. oldEndIndex 与 newEndIndex 指针比较。

若两者的 key 相同，则只需要 patch 打补丁更新内容即可。

oldEndIndex--，newEndIndex--

3. oldStartIndex 与 newEndIndex 指针比较。

若两者的 key 相同，先通过 patch 操作进行打补丁，再将索引 oldStartIndex 指向的虚拟节点所对应的真实 DOM 移动到索引 newEndIndex 指向的虚拟节点所对应的真实 DOM 后面。

oldStartIndex++，newEndIndex--

4. oldEndIndex 与 newStartIndex 指针比较。

若两者的 key 相同，先通过 patch 操作进行打补丁，再将索引 oldEndIndex 指向的虚拟节点所对应的真实 DOM 移动到索引 oldStartIndex 指向的虚拟节点所对应的真实 DOM 前面。

oldEndIndex--，newStartIndex++

5. 若经过以上四次比较均找不到相同 key 的元素时，从旧节点数组中找到与新节点数组头节点的 key 相同的节点，并将其移动到当前未更新的旧节点数组的头部。

若找不到，则表示新节点数组的头节点是新增的，则将该节点移动到旧节点的头节点之前

## 三、快速 Diff 算法

先对相同的前置节点进行 `patch` 操作，再对相同的后置节点进行 `patch` 操作。

接着处理剩余节点，若旧节点已全部处理过，则挂载剩余新节点，若新节点已全部处理过，则卸载剩余旧节点。

若新节点数组合旧节点数组都存在未处理的节点，则进行以下操作：

构建 `source` 数组。该数组的长度等于新的一组子节点去掉相同的前置/后置节点后，剩余**未处理节点**的数量。`source` 数组中存储着新的一组子节点中的节点在旧的一组子节点中的索引位置，若该旧子节点不存在则为 -1，后面我们会根据 `source` 数组计算出一个**最长递增子序列 **`**seq**`，用于 `DOM` 移动操作。

> `seq` 的含义是：**在新的一组子节点中，重新编号后，**`**seq**`** 索引数组对应的节点，其更新前后顺序没有发生变化。**例如 `seq` 的值为 [0, 1]，则重新编号后索引值为 0 和 1 的这两个节点在更新前后顺序没有发生变化。

![image](https://cdn.jsdelivr.net/gh/Cwd295645351/picx-images-hosting@master/block/image.6f0mukgdl4.webp)

取两个索引值 **i**和 **s**：

- 用索引 i 指向新的一组子节点中的最后一个节点；
- 用索引 s 指向最长递增子序列中的最后一个元素

![image](https://cdn.jsdelivr.net/gh/Cwd295645351/picx-images-hosting@master/block/image.3uushxl1te.png)

开启一个 for 循环，让变量 i 和 s 按照图 中箭头的方向移动，以便能够逐个访问新的一组子节点中的节点，这里的变量 i 就是节点的索引。在 for 循环内，判断条件 **i !== seq[s]**，如果节点的索引 i 不等于 seq[s] 的值，则说明该节点对应的真实 DOM 需要移动，否则说明当前访问的节点不需要移动，但这时变量 s 需要按照图中箭头的方向移动，即让变量 s 递减。
