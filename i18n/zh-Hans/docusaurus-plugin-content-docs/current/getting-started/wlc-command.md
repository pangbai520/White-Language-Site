---
sidebar_position: 3
description: 使用 wlc 编译 White 程序时常用的驱动参数。
---

# wlc 命令

`wlc` (White Language Compiler) 同时是 White 编译器前端与原生构建驱动。它的一般调用形式为：

```text
wlc <source.wl> [native files...] [options]
```

第一个位置参数是 White 入口文件。其他 White 源文件通常通过 `import` 进入程序；
原生源码、目标文件与库文件则可以作为额外文件交给链接步骤。

`wlc --help` 会列出当前编译器真正支持的参数。下面说明 White 日常构建最常用
的部分。

## 输出名称

没有使用 `-o` 时，输出名称由入口文件决定：

| 构建类型 | Windows | Linux | macOS |
|---|---|---|---|
| 可执行文件 | `hello.exe` | `hello` | `hello` |
| 共享库 | `hello.dll` | `libhello.so` | `libhello.dylib` |
| 目标文件 | `hello.obj` | `hello.o` | `hello.o` |
| 汇编 | `hello.s` | `hello.s` | `hello.s` |

`-o <path>` 会替换完整输出路径，驱动不会为明确指定的名称自动添加后缀。

```bash
wlc src/main.wl -o build/app
```

编译前需要自行创建目标目录；`wlc` 不会为 `-o` 创建缺失的父目录。

## 优化与调试信息

默认优化等级是 `-O2`。

```text
-O0    关闭优化，适合检查生成代码
-O1    启用较轻的优化
-O2    普通优化构建
-O3    更积极的优化执行速度
-Os    优化文件体积
-Oz    更积极的优化文件体积
```

`-g` 让 Clang 写入源码级调试信息，可以与任意优化等级组合：

```bash
wlc main.wl -O0 -g
```

## 在链接前停止

`-c` 生成目标文件，但不进行链接：

```bash
wlc library.wl -c
```

`-S` 生成文本汇编：

```bash
wlc main.wl -S
```

将 `--emit-llvm` 与 `-S` 一起使用会生成文本 LLVM IR，与 `-c` 一起使用则生成
LLVM bitcode：

```bash
wlc main.wl -S --emit-llvm
wlc main.wl -c --emit-llvm
```

默认输出名称分别是 `main.ll` 和 `main.bc`。

## 检查前端输出

`--dump-ast` 将解析后的抽象语法树写到标准输出，`--dump-ir` 则写出生成的 LLVM
IR。这些参数主要用于编译器开发，其输出格式不是稳定接口。

普通原生构建会删除临时 `.ll` 文件，`--keep-temps` 可以将它留下。`-v` 会显示
构建阶段、选中的后端程序，以及传给后端的每个参数。

```bash
wlc main.wl -v --keep-temps
```

## 共享库

`--shared` 构建共享库而不是可执行文件：

```bash
wlc exports.wl --shared
```

Windows 驱动会在 DLL 旁同时生成对应的导入库。明确使用 `-o math.dll` 时，导入库
为 `math.lib`。Linux 与 macOS 只有在输出名称交给驱动决定时，才会自动增加通常的
`lib` 前缀。

White 导出入口使用 `@ExportLib`。原生互操作与 ABI 规则会在 Language Guide 中
单独说明。

## 原生库

`-L <directory>` 与 `--library-path <directory>` 都会增加链接器的库搜索目录，
也可以使用连写形式：

```bash
wlc app.wl -L ./native/lib
wlc app.wl -L./native/lib
```

extern 声明中的 `in "name"` 会增加相应的 `-lname` 链接参数。当普通库声明和搜索
目录仍然不够时，可以通过 `--ldflags` 传递额外链接参数：

```bash
wlc app.wl --ldflags "-pthread -lcustom"
```

`--ldflags` 是留给原生工具链的出口。某个链接器接受的参数不一定能用于另一平台。

## 目标与系统根目录

`--target <triple>` 选择编译目标，下面两种形式都有效：

```bash
wlc main.wl --target x86_64-unknown-linux-gnu
wlc main.wl --target=x86_64-unknown-linux-gnu
```

`wlc --target-help` 会列出当前编译器认识的准确目标名称。`--sysroot <directory>`
向 Clang 提供目标平台的头文件与库。只生成 LLVM IR、汇编或目标文件时，选择 triple
通常已经足够；要链接另一操作系统的程序，还需要准备对应 SDK 或 system root。

不同宿主与目标组合的配置方式并不相同，因此交叉编译会放在 **Compiler and Tools**
中单独说明。

## 退出状态

构建成功后 `wlc` 返回零；前端、后端或链接失败时返回非零状态。普通成功构建最后
会输出：

```text
Build success: <output>
```

自动化脚本应检查进程退出状态，不要依赖匹配这行文字。
