---
sidebar_position: 1
---

# White Language 介绍

**White Language** 是一门追求“ARC 的安全性”与“C 的精确性”的编程语言。

我们致力于解决系统编程中内存安全与底层控制之间的矛盾。通过自研的 **Automatic Reference Counting (ARC)** 机制，White Language 在不引入垃圾回收（GC）开销的前提下，提供了接近内存安全的开发体验。

## 核心特性

- **确定性内存管理**：基于编译器注入的引用计数，内存释放时机完全可预测。
- **极致的 C 兼容性**：无需复杂的封装，直接声明 `extern` 即可调用 C 标准库。
- **自举编译器**：White Language 的编译器 `wlc` 是由 White Language 自身编写的。
- **LLVM 后端**：生成的代码经过 LLVM 深度优化，拥有原生性能。

## 快速预览

这是一个简单的 White Language 程序：

```rust
import "builtin"

func main() -> Int {
    let message -> String = "Hello White Language World!";
    builtin.print(message);
    return 0;
}