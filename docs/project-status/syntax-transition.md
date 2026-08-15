---
sidebar_position: 1
title: 0.3.4 syntax transition
description: Moving White source from the old declaration syntax to the current syntax.
---

# White Language 0.3.4 — Syntax Transition Release

White 0.3.4 accepts both the previous declaration syntax and the syntax used by
the current language. It exists so that a project can update its compiler,
source, editor support, and build scripts without changing all of them at once.

All examples in this documentation use the current syntax. Source written for
releases before 0.3.4 uses an earlier syntax and will not necessarily match the
documentation. Version 0.3.4 can compile that source while it is being updated;
0.3.5 removes the compatibility syntax.

Keep a copy of the 0.3.4 toolchain when moving an older project forward. Its
packages remain available on the [download page](/download).

## Declarations

Variable, parameter, and field types now follow `:`. The return type remains
after `->`:

```white
let count: Int = 10;
let inferred = 10;
let explicit: Auto = 10;

func add(left: Int, right: Int) -> Int {
    return left + right;
}
```

When a declaration has an initializer, the type may be omitted if the compiler
can determine it statically. Fields without an initializer still need an
explicit type.

## Class and interface functions

Classes and interfaces use `func` for functions declared in their body:

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

## Callable types

The arguments stay inside parentheses. The callable return type is written
after the parentheses:

```white
let callback: Function(Int) -> Int = increment;
let method: Method() -> Int = counter.get;
```
