---
sidebar_position: 2
description: 编译并运行一个小型 White 程序。
---

# 第一个程序

创建一个空目录，将下面的代码保存为 `hello.wl`：

```white title="hello.wl"
func main() -> Int {
    print("hello, White");
    return 0;
}
```

在这个目录中编译：

```bash
wlc hello.wl
```

Windows 会生成 `hello.exe`：

```powershell
.\hello.exe
```

Linux 与 macOS 生成的文件没有后缀：

```bash
./hello
```

程序输出：

```text
hello, White
```

## 这段代码写了什么

`main` 是可执行程序的入口。它返回一个 `Int`，该数值会成为进程退出状态。按照
惯例，返回零表示程序正常结束。

```white
func main() -> Int {
```

`print` 会写出所有参数，并在末尾换行。它属于 White 的 prelude，因此这个程序
不需要先导入打印函数。

```white
print("hello, White");
```

语句以分号结束，代码块使用花括号，块末尾的右花括号后不再加分号。

## 增加一个函数

下面把消息交给单独的函数生成，让 `main` 只保留程序入口的工作：

```white title="hello.wl"
func greeting(name: String) -> String {
    return "hello, " + name;
}

func main() -> Int {
    let message = greeting("White");
    print(message);
    return 0;
}
```

参数名称与类型之间使用 `:`，参数列表后面的 `->` 只表示返回类型。声明带有初始化
式，并且编译器能够确定其类型时，可以像这里的 `message` 一样省略类型。需要明确
写出推导类型时，`let message: Auto = ...` 也仍然有效。

再次执行相同的编译命令即可。构建成功后，`wlc` 会替换上一次生成的文件。

## 指定输出名称

如果不希望可执行文件跟随源码名称，可以使用 `-o`：

```bash
wlc hello.wl -o greeting
```

Windows 应明确写出需要的后缀：

```powershell
wlc hello.wl -o greeting.exe
```

遇到编译错误时，`wlc` 会给出源文件、行列位置和出错的源码片段。前端检查失败后
不会继续生成机器码，也不会覆盖此前已经成功生成的文件。
