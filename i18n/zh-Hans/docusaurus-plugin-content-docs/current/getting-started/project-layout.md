---
sidebar_position: 4
description: 安排 White 源文件、模块、包与构建输出。
---

# 项目结构

小型 White 程序不需要项目清单。`wlc` 从一个入口文件开始，并沿着其中的 import
读取其他源码，因此单文件项目只需要：

```text
hello/
└── main.wl
```

在项目目录中编译：

```bash
wlc main.wl
```

没有使用 `-o` 时，可执行文件会写在 `main.wl` 旁边。会产生多个输出的项目可以
使用单独的构建目录，避免生成文件与源码混在一起：

```bash
wlc src/main.wl -o build/app
```

`build` 目录需要事先创建。

## 多个源文件

导入本地 White 文件时需要明确写出 `.wl` 后缀：

```text
hello/
├── main.wl
└── greeting.wl
```

```white title="greeting.wl"
func message(name: String) -> String {
    return "hello, " + name;
}
```

```white title="main.wl"
import "greeting.wl"

func main() -> Int {
    print(greeting.message("White"));
    return 0;
}
```

普通模块导入会用文件名建立命名空间。导入只在写出它的源文件中可见：某个模块
导入了 `greeting.wl`，并不会让整个程序都能直接使用 `greeting`。

路径以执行 import 的文件为基准解析，而不是以启动 `wlc` 时碰巧所在的目录为基准。
因此从其他目录调用编译器时，项目内部导入仍能保持不变。

## 目录包

目录中存在 `_pkg.wl` 时，它可以作为包导入。这个文件负责定义包的公开结构：

```text
hello/
├── main.wl
└── model/
    ├── _pkg.wl
    └── user.wl
```

```white title="model/user.wl"
class User {
    let name: String;

    init(name: String) {
        self.name = name;
    }
}
```

```white title="model/_pkg.wl"
import User from "user.wl"
```

```white title="main.wl"
import "model"

func main() -> Int {
    let user: model.User = model.User("White");
    print(user.name);
    return 0;
}
```

在 `_pkg.wl` 中，具名导入会通过包重新导出该符号；`import * from "file.wl"`
会重新导出文件中的全部公开符号；普通的 `import "file.wl"` 则保留子模块命名空间。
普通源文件不会重新导出自己导入的内容。

以 `__` 开头的名称是私有名称，不能跨越模块或包边界导入。

## 标准库导入

标准库包和文件从 `WL_PATH/std` 查找，导入时不写 `.wl` 后缀：

```white
import "file"
import "json"
import "strings"
import "sys"
```

这与 `import "parser.wl"` 这样的本地文件导入不同。后缀明确表示路径指向一个源码
文件，而不是标准模块或目录包。

`builtin`、标准 `Error` 类型与 Dict 支持会接入 prelude，因此代码可以直接使用
其中的非限定名称。需要 `builtin.print(...)` 这样的限定调用时，仍然可以明确写出
`import "builtin"`。

`std/internal` 只供标准库实现使用，用户项目无法导入该目录。
