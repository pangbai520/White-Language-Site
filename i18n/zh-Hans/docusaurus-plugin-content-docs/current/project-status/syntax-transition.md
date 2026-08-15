---
sidebar_position: 1
title: 0.3.4 语法迁移
description: 将 White 源码从旧声明语法迁移到当前语法。
---

# White Language 0.3.4 — 语法过渡版本

White 0.3.4 同时接受此前的声明语法与当前语言使用的语法。项目可以先更新编译器，
再分别迁移源码、编辑器支持与构建脚本，不必一次完成全部修改。

本文档中的所有示例都使用当前语法。0.3.4 以前版本所使用的源码语法与当前文档
不同，不能直接以这里的示例为准。0.3.4 可以在项目更新期间继续编译这些源码；
0.3.5 将删除兼容语法。

升级旧项目时请保留一份 0.3.4 工具链；它的发布包会一直留在
[下载页面](/download)。

## 声明

变量、参数与字段使用 `:` 标注类型，`->` 只放在返回类型前：

```white
let count: Int = 10;
let inferred = 10;
let explicit: Auto = 10;

func add(left: Int, right: Int) -> Int {
    return left + right;
}
```

声明带有初始化式，并且编译器能够静态确定其类型时，可以省略类型。没有初始化式
的字段仍需明确写出类型。

## class 与 interface 中的函数

class 与 interface 内声明的函数统一使用 `func`：

```white
class Counter {
    let value: Int;

    init(value: Int) {
        self.value = value;
    }

    func get() -> Int {
        return self.value;
    }
}
```

## callable 类型

参数类型仍写在括号中，callable 的返回类型移到括号后：

```white
let callback: Function(Int) -> Int = increment;
let method: Method() -> Int = counter.get;
```
