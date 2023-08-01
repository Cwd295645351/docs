(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{289:function(s,t,a){"use strict";a.r(t);var n=a(10),r=Object(n.a)({},(function(){var s=this,t=s._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h1",{attrs:{id:"适配器模式"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#适配器模式"}},[s._v("#")]),s._v(" 适配器模式")]),s._v(" "),t("h2",{attrs:{id:"一、概述"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#一、概述"}},[s._v("#")]),s._v(" 一、概述")]),s._v(" "),t("p",[s._v("适配器模式是一种结构型设计模式，用于将一个类的接口转换成客户端所期望的另一个接口，从而使得原本不兼容的类可以协同工作。适配器模式的主要作用是将一个类的接口转换成客户端所期望的接口，以便客户端可以使用这个类。")]),s._v(" "),t("h2",{attrs:{id:"二、优缺点"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#二、优缺点"}},[s._v("#")]),s._v(" 二、优缺点")]),s._v(" "),t("h3",{attrs:{id:"_1-优点"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-优点"}},[s._v("#")]),s._v(" 1. 优点")]),s._v(" "),t("ul",[t("li",[s._v("可以让原本不兼容的类可以协同工作")]),s._v(" "),t("li",[s._v("可以提高代码复用性和灵活性")])]),s._v(" "),t("h3",{attrs:{id:"_2-缺点"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2-缺点"}},[s._v("#")]),s._v(" 2. 缺点")]),s._v(" "),t("ul",[t("li",[s._v("增加了代码的复杂度和理解难度")]),s._v(" "),t("li",[s._v("如果适配器不完善，会对系统性能产生一定的影响")])]),s._v(" "),t("h2",{attrs:{id:"三、适用场景"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#三、适用场景"}},[s._v("#")]),s._v(" 三、适用场景")]),s._v(" "),t("ul",[t("li",[s._v("需要使用一个已有的类，但是这个类的接口与当前的代码不兼容")]),s._v(" "),t("li",[s._v("需要创建一个复合类，将多个类的功能组合在一起")]),s._v(" "),t("li",[s._v("需要透明地使用多个类的接口，同时又不能改变这些类的接口")])]),s._v(" "),t("h2",{attrs:{id:"四、例子"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#四、例子"}},[s._v("#")]),s._v(" 四、例子")]),s._v(" "),t("div",{staticClass:"language-js line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 定义一个需要被适配的函数")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("square")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token parameter"}},[s._v("x")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("return")]),s._v(" x "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("*")]),s._v(" x\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 定义一个适配器函数，将输入参数转换为需要被适配函数的参数格式")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("function")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("squareAdapter")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token parameter"}},[s._v("obj")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("return")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("square")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("obj"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("num"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 定义一个对象，它的接口不符合需要被适配函数的接口")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("let")]),s._v(" obj "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("value")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("5")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 使用适配器函数将对象的接口转换为需要被适配函数的接口，并调用被适配函数")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("let")]),s._v(" result "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("squareAdapter")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token literal-property property"}},[s._v("num")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" obj"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("value "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\nconsole"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("log")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("result"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 25")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br"),t("span",{staticClass:"line-number"},[s._v("13")]),t("br"),t("span",{staticClass:"line-number"},[s._v("14")]),t("br"),t("span",{staticClass:"line-number"},[s._v("15")]),t("br"),t("span",{staticClass:"line-number"},[s._v("16")]),t("br"),t("span",{staticClass:"line-number"},[s._v("17")]),t("br"),t("span",{staticClass:"line-number"},[s._v("18")]),t("br")])]),t("p",[s._v("在这个例子中，"),t("code",[s._v("square()")]),s._v(" 是需要被适配的函数，它接受一个数字并返回它的平方。但是，我们有一个对象 "),t("code",[s._v("obj")]),s._v(" ，它的接口不符合 "),t("code",[s._v("square()")]),s._v("函数的接口。因此，我们需要编写一个适配器函数 "),t("code",[s._v("squareAdapter()")]),s._v(" ，将 obj 对象的接口转换为 "),t("code",[s._v("square()")]),s._v("函数的接口。适配器函数接受一个对象作为输入参数，并从中提取出 "),t("code",[s._v("num")]),s._v(" 属性作为 "),t("code",[s._v("square()")]),s._v(" 函数的参数，并返回 "),t("code",[s._v("square()")]),s._v(" 函数的结果。")]),s._v(" "),t("h2",{attrs:{id:"五、总结"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#五、总结"}},[s._v("#")]),s._v(" 五、总结")]),s._v(" "),t("p",[s._v("适配器模式是一种用于解决组件之间接口不兼容问题的设计模式。它可以将一个类的接口转换成客户端所期望的另一个接口，从而使得原本不兼容的类可以协同工作。适配器模式适用于需要使用一个已有的类，但是这个类的接口与当前的代码不兼容的情况。适配器模式的优优点包括可以提高代码复用性和灵活性，缺点则包括增加了代码的复杂度和理解难度以及如果适配器不完善，可能会对系统性能产生影响。适配器模式适用于需要透明地使用多个类的接口，同时又不能改变这些类的接口的情况，以及需要创建一个复合类，将多个类的功能组合在一起的情况。")]),s._v(" "),t("p",[s._v("总的来说，适配器模式是一种强大的设计模式，可以帮助我们解决不同模块或组件之间接口不兼容的问题。它在实际应用中非常广泛，无论是在前端还是后端开发中都有应用。如果你想让你的代码更加灵活和可复用，适配器模式是一个非常值得学习和掌握的设计模式。")])])}),[],!1,null,null,null);t.default=r.exports}}]);