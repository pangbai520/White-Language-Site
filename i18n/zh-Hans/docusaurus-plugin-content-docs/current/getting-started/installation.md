---
sidebar_position: 1
description: 安装 White 发布包并配置 wlc。
---

# 安装

一份完整的 White 工具链包含编译器、标准库，以及编译器驱动所需的原生工具。除非
准备修改 `wlc` 本身，否则应从二进制发布包开始；从源码重新构建编译器仍然需要
一份已有的 White 工具链。

## 下载发布包

[下载页面](/download)会列出公共镜像中实际存在的文件。请选择与运行 `wlc` 的
操作系统和架构一致的版本。

Windows 使用安装程序，Linux 与 macOS 使用压缩包。安装或解压完成后，工具链
根目录大致如下：

```text
WhiteLanguage/
├── bin/
│   ├── wlc
│   └── wlls
├── std/
└── tools/
    └── llvm/
```

Windows 中的可执行文件带有 `.exe` 后缀。`tools/llvm` 是随发布包提供的 Clang
工具链，负责生成机器码和完成链接。

## 配置环境变量

`WL_PATH` 必须指向上面的 `WhiteLanguage` 目录，不能指向 `bin`、`std`，也不能
直接指向编译器文件。再将 `WhiteLanguage/bin` 加入 `PATH`，便可以在安装目录以外
直接运行 `wlc`。

只为当前 PowerShell 会话设置：

```powershell
$env:WL_PATH = "C:\path\to\WhiteLanguage"
$env:Path = "$env:WL_PATH\bin;$env:Path"
```

只为当前 Bash、Zsh 或兼容 shell 会话设置：

```bash
export WL_PATH="$HOME/path/to/WhiteLanguage"
export PATH="$WL_PATH/bin:$PATH"
```

需要长期保留时，请通过操作系统或 shell 平时使用的方式保存同样的变量。Windows
安装程序将自动完成配置；安装结束后应先打开一个新终端再检查。

## 检查安装

运行：

```bash
wlc --help
```

第一行应显示当前编译器版本，后面是可用的驱动参数。若要同时检查标准库路径，保存
下面的文件：

```white title="check.wl"
import "sys"

func main() -> Int {
    print("White is running on ", sys.OS);
    return 0;
}
```

```bash
wlc check.wl
```

Windows 运行 `check.exe`，Linux 与 macOS 运行 `./check`。能够正常编译和执行，
说明 `wlc`、标准库与后端工具链都已找到。

## 常见安装问题

`Missing 'WL_PATH' variable.` 表示启动 `wlc` 的终端看不到这个变量。请在当前会话
设置它，或者在修改系统环境后重新打开终端。

如果错误指出某个标准库模块不存在，通常是 `WL_PATH` 多了一层或少了一层目录。
该变量所指向的目录中应当直接包含 `std`。

如果 `wlc` 无法启动 Clang，先检查安装目录中是否存在
`tools/llvm/bin/clang`。找不到随附工具链时，驱动会改用 `PATH` 中的系统 `clang`。

在 Linux 与 macOS 上，某些解压方式可能丢失可执行权限。shell 报告
`Permission denied` 时，可以恢复编译器与 Clang 的权限：

```bash
chmod +x "$WL_PATH/bin/wlc" "$WL_PATH/tools/llvm/bin/clang"
```

从另一台机器复制工具链时，应让 `bin`、`std` 和 `tools/llvm` 保持在一起。只复制
一个 `wlc` 文件并不是完整安装。
