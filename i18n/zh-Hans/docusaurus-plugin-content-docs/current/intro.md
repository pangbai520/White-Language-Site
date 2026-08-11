---
sidebar_position: 1
description: White 是什么、如何编译一个小程序，以及项目目前处于什么阶段。
---

# White 简介

White 是一门静态类型语言，`.wl` 源文件会被编译为原生程序。它的编译器
`wlc` 也使用 White 编写。前端负责检查程序并生成 LLVM IR，随后由 Clang
完成机器码生成与链接。

这个项目希望同时守住三件事：生成可预测的原生代码，语法不需要太多仪式，
以及在错误变成内存破坏之前给出明确检查。这些是 White 的设计约束，并不代表
它已经补齐了成熟系统语言所拥有的一切。

## 第一个程序

将下面的代码保存为 `hello.wl`：

```white
func main() -> Int {
    print("hello, White");
    return 0;
}
```

使用 `wlc` 编译：

```bash
wlc hello.wl
```

在 Linux 与 macOS 上运行：

```bash
./hello
```

在 Windows 上运行：

```powershell
.\hello.exe
```

`main` 是程序入口，它返回的 `Int` 会成为进程退出状态。`print` 属于 prelude，
普通源文件不需要先导入它。

编译器通过 `WL_PATH` 寻找 White 的安装根目录。一份完整安装大致如下：

```text
WhiteLanguage/
├── bin/
├── std/
└── tools/
```

正式发布包会处理好这项配置。使用复制或本地构建的工具链时，`WL_PATH` 应指向
上面的 `WhiteLanguage` 目录，而不是其中的 `bin` 或 `std`。

## 类型在程序运行前确定

类型可以直接写出：

```white
let count -> Int = 3;
let name -> String = "White";
```

也可以让编译器通过 `Auto` 推导具体类型：

```white
let count -> Auto = 3;
let name -> Auto = "White";
```

这只是编译期推导。它不会把变量变成动态类型，也不会为变量增加运行时类型标签。

White 不会把整数当作布尔值。条件表达式必须是 `Bool`：

```white
let count -> Int = 3;

if (count != 0) {
    print("not empty");
}
```

语言提供从 8 位到 128 位的有符号与无符号整数，以及跟随指针宽度的 `IntSize`
和 `UIntSize`。相同位宽的有符号数与无符号数不能隐式混用；White 不采用 C 的
无符号隐式转换规则。

## 错误属于返回类型

可能失败的函数返回 `T?` 或 `Void?`。调用方在调用处使用 `?`，并通过紧随其后的
`catch` 处理错误：

```white
func main() -> Int {
    let name -> String = input("name: ")?;
    catch(err) {
        print("could not read a name: ", err);
        return 1;
    }

    print("hello, ", name);
    return 0;
}
```

如果当前函数本身也允许失败，可以继续向调用方传播错误。库可以声明自己的错误域，
因此 I/O 错误与 JSON 错误不必挤在同一个全局枚举中。

错误路径同样接受确定初始化检查。一次失败的赋值不能留下未初始化变量，然后让后续
代码继续读取它。

## 托管值使用 ARC

字符串、class 实例、interface、闭包与共享切片存储由原子引用计数(Atomic Reference Counting)管理。class
可以定义 `deinit`，最后一个所有引用释放时会调用它。

```white
class LogFile {
    let path -> String;

    init(path -> String) {
        self.path = path;
    }

    deinit() {
        print("closing ", self.path);
    }
}
```

如果每个初始化函数都会赋值，class 字段便不需要随手写一个默认值。编译器会拒绝
提前读取字段、遗漏字段赋值，或在初始化完成前让 `self` 逃逸。

ARC 能够确定资源释放的时间，但它不是追踪式垃圾回收器。完全由强引用组成的环会
发生泄漏。White 目前还没有弱引用，因此创建循环对象图的程序需要自己打破环。

## String 是 UTF-8 字节串

`String` 保存字节长度与容量。`length()` 是 O(1) 操作，直接索引返回 `Byte`：

```white
let text -> String = "香蕉Banana🍌";
print(text.length()); // 8

let first -> Byte = text[0];
let chinese -> Char = text.char_at(1)?;
catch(err) { return 1; }
```

在 UTF-8 中查找第 n 个 Unicode scalar 必须从前向后扫描，所以 White 不会把这项
成本藏在 `text[index]` 后面。需要字符操作时，应明确使用 `char_at`、
`char_count`、`is_char_boundary` 与 `is_valid_utf8`。

Array、Vector 与 String 范围都采用左闭右开。普通切片会复制元素存储；带 `ref`
的切片是共享视图，并会保持底层存储存活。

## 原生边界保持显式

White 可以声明 C ABI 与 system ABI 函数，也能构建共享库。裸指针、`AnyPtr` 与
`extern` 声明依然是不安全边界，编译器无法验证原生函数签名是否真的与目标库一致。

Windows 程序的启动、内存分配、文件、进程与控制台 I/O 直接使用系统 API，不链接
MSVCRT 或 UCRT。Linux 与 macOS 则使用各自平台的 libc 与 POSIX 接口。这两种选择
都是有意为之；White 不会假装每个操作系统都有相同的原生边界。

## 目前已有的内容

当前编译器提供：

- Array、Vector、切片、enum、struct、class、继承与 interface；
- 一等函数、绑定方法与闭包；
- 可失败函数与用户自定义错误域；
- 模块、包、私有符号与受控的通配导入；
- C 与 system ABI 声明、原生库搜索路径与共享库导出；
- string、文件、进程、环境变量、标准 I/O、Dict 与 JSON 标准库；
- Windows、Linux 与 macOS，以及[下载页面](/download)列出的架构。

这份列表只表示对应语言表面已经实现，不代表它们已经达到生产级成熟度。泛型仍然
有限，`Dict` 还不是通用泛型 Map，ARC 无法回收循环引用，网络、线程、异步 I/O
与完整文件系统库也仍未完成。

White 目前更适合编译器开发、语言实验与小型原生程序。依赖稳定 ABI 或成熟标准库
的代码还应等待后续版本。

[主仓库](https://github.com/whitelanguage/white)中包含编译器、标准库、测试、自举说明
以及当前已知限制。
