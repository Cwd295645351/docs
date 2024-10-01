(window.webpackJsonp=window.webpackJsonp||[]).push([[35],{316:function(v,t,_){"use strict";_.r(t);var s=_(10),a=Object(s.a)({},(function(){var v=this,t=v._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[t("h1",{attrs:{id:"v8-垃圾回收机制"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#v8-垃圾回收机制"}},[v._v("#")]),v._v(" V8 垃圾回收机制")]),v._v(" "),t("h2",{attrs:{id:"代际假说和分代收集"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#代际假说和分代收集"}},[v._v("#")]),v._v(" 代际假说和分代收集")]),v._v(" "),t("p",[v._v("代际假说有两个特点：")]),v._v(" "),t("ul",[t("li",[v._v("第一个是大部分对象在内存中存在的时间很短，简单来说，就是很多对象一经分配内存，很快就变得不可访问；")]),v._v(" "),t("li",[v._v("第二个是不死的对象，会活得更久。")])]),v._v(" "),t("p",[v._v("V8 会把内存堆分为"),t("strong",[v._v("新生代")]),v._v("和"),t("strong",[v._v("老生代")]),v._v("两个区域，新生代存放生命周期短的对象，老生代则存放生命周期长的对象。在 64 位系统中，老生代的空间大概 1400M，新生代的空间为 32M。在 32 位系统中，老生代的空间大概为 700M，新生代的空间为 16M。对于这两块区域， V8 使用两个不同的垃圾回收器。")]),v._v(" "),t("ul",[t("li",[v._v("副垃圾回收器，负责新生代的垃圾回收。")]),v._v(" "),t("li",[v._v("主垃圾回收器，负责老生代的垃圾回收。")])]),v._v(" "),t("p",[v._v("针对不同区域，V8 采用了不同的垃圾回收算法，但是都有相同的执行流程。")]),v._v(" "),t("ol",[t("li",[v._v("标记空间中活动对象和非活动对象。非活动对象即可以进行垃圾回收的对象；")]),v._v(" "),t("li",[v._v("统一清理内存中被标记为可回收的对象；")]),v._v(" "),t("li",[v._v("内存整理。当清理完内容后，会存在大量不连续的空间，因此需要重新整理。")])]),v._v(" "),t("h2",{attrs:{id:"新生代垃圾回收"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#新生代垃圾回收"}},[v._v("#")]),v._v(" 新生代垃圾回收")]),v._v(" "),t("p",[v._v("通常情况下，大多数小的对象都会被分配到新生代，因此新生代的垃圾回收比较频繁。")]),v._v(" "),t("p",[v._v("新生代中采用了 "),t("strong",[v._v("Scavenge 算法")]),v._v("来处理，即把新生代会对半划分为两个区域，一半是对象空间 "),t("code",[v._v("from")]),v._v("，另一半是空闲空间 "),t("code",[v._v("to")]),v._v("。")]),v._v(" "),t("p",[v._v("一开始所有元素都在 "),t("code",[v._v("from")]),v._v(" 空间，当该空间快满时则执行垃圾回收操作。")]),v._v(" "),t("p",[t("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/Cwd295645351/picx-images-hosting@master/block/%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B61.4xudtwl91c.webp",alt:"垃圾回收1"}})]),v._v(" "),t("p",[v._v("执行垃圾回收时，副垃圾回收器先标记活动对象，并将这些对象复制到 "),t("code",[v._v("to")]),v._v(" 空间，使得 "),t("code",[v._v("to")]),v._v(" 空间的内存是连续的。")]),v._v(" "),t("p",[t("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/Cwd295645351/picx-images-hosting@master/block/%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B62.2krrcpadfv.webp",alt:"垃圾回收2"}})]),v._v(" "),t("p",[v._v("接着清除 "),t("code",[v._v("from")]),v._v(" 空间，回收非活动对象所占用的内存空间。")]),v._v(" "),t("p",[t("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/Cwd295645351/picx-images-hosting@master/block/%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B63.3k7upvc2jq.webp",alt:"垃圾回收3"}})]),v._v(" "),t("p",[v._v("最后 "),t("code",[v._v("from")]),v._v(" 空间和 "),t("code",[v._v("to")]),v._v(" 空间的角色会发生交换，下一次的垃圾回收将在新的 "),t("code",[v._v("to")]),v._v(" 空间中进行。")]),v._v(" "),t("p",[t("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/Cwd295645351/picx-images-hosting@master/block/%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B64.pf6k2wx4s.webp",alt:"垃圾回收4"}})]),v._v(" "),t("p",[v._v("新生代存在以下晋升机制：")]),v._v(" "),t("ol",[t("li",[v._v("当对象从 "),t("code",[v._v("from")]),v._v(" 空间复制到 "),t("code",[v._v("to")]),v._v(" 空间的过程中，若 "),t("code",[v._v("to")]),v._v(" 空间的内存占用率超过 25% 时，则该对象直接晋升到老生代。这是为了避免新生代内存被过快地填满，导致频繁触发垃圾回收。")]),v._v(" "),t("li",[v._v("经过两次垃圾回收仍存活的对象会晋升到老生代。")])]),v._v(" "),t("h2",{attrs:{id:"老生代垃圾回收"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#老生代垃圾回收"}},[v._v("#")]),v._v(" 老生代垃圾回收")]),v._v(" "),t("p",[v._v("老生代中除了从新生代进行的对象外，一些大的对象也会直接分配到老生代，因此老生代中的对象特点是内存空间占用大和存活时间长。")]),v._v(" "),t("p",[v._v("由于 "),t("strong",[v._v("Scavenge 算法")]),v._v("在处理存活时间长和大内存对象时存在效率和内存利用率方面的不足，因此 V8 引擎选择使用"),t("strong",[v._v("标记-清除")]),v._v("（Mark-Sweep）和"),t("strong",[v._v("标记-整理")]),v._v("（Mark-Compact）算法来处理老生代的垃圾回收。")]),v._v(" "),t("p",[v._v("在标记清除算法中，V8 引擎会从根对象开始，遍历所有可达对象并进行标记。在标记阶段结束后，未被标记的对象即被视为垃圾，进而被清理释放内存。然而，标记清除算法可能会导致内存碎片化的问题，即内存空间被分割成许多不连续的小块，影响后续大对象的分配和内存的使用效率。")]),v._v(" "),t("p",[v._v("V8 引擎的标记整理算法可以看作是标记清除算法的增强。其实现原理如下：")]),v._v(" "),t("ol",[t("li",[v._v("标记阶段：和标记清除算法一样，遍历所有对象，将可达的活动对象进行标记。")]),v._v(" "),t("li",[v._v("整理阶段：在清除之前进行整理操作，移动活动对象的位置，使它们在内存地址上变得连续。")]),v._v(" "),t("li",[v._v("回收阶段：对活动对象右侧的空间进行整体回收。")])]),v._v(" "),t("p",[v._v("通过这样的方式，标记整理算法解决了标记清除算法导致的内存碎片化问题。回收后得到的内存空间基本上是连续的，在后续使用中可以尽可能地最大化利用释放出来的空间。")]),v._v(" "),t("h2",{attrs:{id:"垃圾回收机制"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#垃圾回收机制"}},[v._v("#")]),v._v(" 垃圾回收机制")]),v._v(" "),t("ul",[t("li",[v._v("全停顿")])]),v._v(" "),t("p",[v._v("由于 JavaScript 是运行在主线程之上的，一旦执行垃圾回收算法，都需要将正在执行的 JavaScript 脚本暂停下来，待垃圾回收完毕后再恢复脚本执行。我们把这种行为叫做全停顿。")]),v._v(" "),t("p",[t("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/Cwd295645351/picx-images-hosting@master/block/%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B65.7i086kpkgb.webp",alt:"垃圾回收5"}})]),v._v(" "),t("ul",[t("li",[v._v("增量垃圾回收")])]),v._v(" "),t("p",[v._v("增量回收是为了减少垃圾回收过程中的停顿时间，将回收操作分解为多个小步骤，穿插在 JavaScript 程序的执行过程中，从而降低对程序执行的影响。把一个完整的垃圾回收任务拆分为很多小的任务，这些小的任务执行时间比较短，可以穿插在其他的 JavaScript 任务中间执行。")]),v._v(" "),t("p",[t("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/Cwd295645351/picx-images-hosting@master/block/%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B66.8kzxhglebu.webp",alt:"垃圾回收6"}})]),v._v(" "),t("ul",[t("li",[v._v("惰性清理")])]),v._v(" "),t("p",[v._v("在增量标记之后，要进行清理非活动对象的时候，垃圾回收器发现了其实就算是不清理，剩余的空间也足以让 JS 代码跑起来，所以就延迟了清理，让 JS 代码先执行，或者只清理部分垃圾，而不清理全部。")]),v._v(" "),t("ul",[t("li",[v._v("并行垃圾回收")])]),v._v(" "),t("p",[v._v("垃圾回收器在主线程中执行垃圾回收的任务的同时，再引入多个辅助线程来并行处理，这样就会加速垃圾回收的执行速度。")]),v._v(" "),t("p",[t("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/Cwd295645351/picx-images-hosting@master/block/%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B67.92pz61mrwr.webp",alt:"垃圾回收7"}})]),v._v(" "),t("ul",[t("li",[v._v("并发垃圾回收")])]),v._v(" "),t("p",[v._v("主线程在执行 JavaScript 的过程中，辅助线程能够在后台完成执行垃圾回收的操作。")]),v._v(" "),t("p",[t("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/Cwd295645351/picx-images-hosting@master/block/%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B68.8dwpm0z8wb.webp",alt:"垃圾回收8"}})]),v._v(" "),t("h2",{attrs:{id:"总结"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#总结"}},[v._v("#")]),v._v(" 总结")]),v._v(" "),t("p",[v._v("V8 引擎的垃圾回收机制是一个高度复杂且精细的系统，通过巧妙的内存区域划分、多种算法的有机结合以及一系列的优化策略，成功实现了对内存的高效管理和利用。开发人员深入理解这一机制，遵循良好的编程规范和实践，能够充分发挥 V8 引擎的优势，构建出性能卓越、稳定可靠的 JavaScript 应用程序。")])])}),[],!1,null,null,null);t.default=a.exports}}]);