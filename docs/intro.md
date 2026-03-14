---
sidebar_position: 1
---

# Introduction to White Language

**White Language** is a programming language that pursues the "safety of ARC" combined with the "precision of C."

We are committed to resolving the conflict between memory safety and low-level control in systems programming. Through our proprietary **Automatic Reference Counting (ARC)** mechanism, White Language provides a near-memory-safe development experience without the overhead of Garbage Collection (GC).

## Core Features

* **Deterministic Memory Management**: Based on compiler-injected reference counting, the timing of memory deallocation is entirely predictable.
* **Extreme C Compatibility**: Call the C standard library directly by declaring `extern` without the need for complex wrappers.
* **Self-Hosting Compiler**: The White Language compiler, `wlc`, is written in White Language itself.
* **LLVM Backend**: Generated code is deeply optimized by LLVM, delivering native performance.

## Quick Preview

Here is a simple White Language program:

```rust
import "builtin"

func main() -> Int {
    let message -> String = "Hello White Language World!";
    builtin.print(message);
    return 0;
}

```