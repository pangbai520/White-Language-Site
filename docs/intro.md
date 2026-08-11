---
sidebar_position: 1
description: What White is, how to build a small program, and where the project stands.
---

# Introduction

White is a statically typed language which compiles `.wl` source files to
native programs. Its compiler, `wlc`, is written in White. The frontend checks
the program and writes LLVM IR; Clang handles machine-code generation and
linking.

The project is trying to keep three things in the same language: predictable
native code, syntax which does not require much ceremony, and safety checks
which report mistakes before they become memory corruption. These are design
constraints, not a claim that White already covers everything provided by an
established systems language.

## A first program

Save this as `hello.wl`:

```white
func main() -> Int {
    print("hello, White");
    return 0;
}
```

Build it with `wlc`:

```bash
wlc hello.wl
```

On Linux and macOS:

```bash
./hello
```

On Windows:

```powershell
.\hello.exe
```

`main` is the program entry point. Its `Int` return value becomes the process
exit status. `print` belongs to the prelude, so an ordinary source file does
not need to import it.

The compiler needs `WL_PATH` to point at the root of a White installation. A
complete installation has this basic layout:

```text
WhiteLanguage/
├── bin/
├── std/
└── tools/
```

The release packages arrange this for you. When working from a copied or
locally built toolchain, set `WL_PATH` to that `WhiteLanguage` directory rather
than to its `bin` or `std` subdirectory.

## Types are settled before the program runs

Types may be written explicitly:

```white
let count -> Int = 3;
let name -> String = "White";
```

`Auto` asks the compiler to infer the concrete type:

```white
let count -> Auto = 3;
let name -> Auto = "White";
```

This is compile-time inference. It does not create a dynamically typed value or
attach a runtime type tag to the variable.

White does not treat integers as booleans. Conditions must have type `Bool`:

```white
let count -> Int = 3;

if (count != 0) {
    print("not empty");
}
```

The language has signed and unsigned integers from 8 through 128 bits, along
with pointer-sized `IntSize` and `UIntSize`. Mixing signed and unsigned values
of the same width requires an explicit conversion; the compiler does not apply
C's implicit unsigned conversion rules.

## Errors are part of the return type

A function which may fail returns `T?` or `Void?`. The caller uses `?` at the
call and handles the result with the following `catch` block:

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

If the containing function is also fallible, the error may be propagated
instead. Libraries can declare their own error domains, so an I/O error and a
JSON error do not have to share one global enumeration.

Variables still follow definite-initialization rules on the error path. A
failed assignment cannot leave a value uninitialized and then allow later code
to read it.

## Managed values use ARC

Strings, class instances, interfaces, closures, and shared slice storage are
managed with atomic reference counting. A class may define `deinit`; it runs
when the final owning reference is released.

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

Class fields may omit a default value when every initializer assigns them. The
compiler rejects an initializer which reads a field too early, leaves it unset,
or lets `self` escape before initialization is complete.

ARC gives deterministic destruction, but it is not a tracing garbage
collector. A cycle made entirely from strong references will leak. White does
not have weak references yet, so programs which construct cyclic object graphs
must break those cycles themselves.

## Strings are UTF-8 byte strings

A `String` stores its byte length and capacity. `length()` is O(1), and direct
indexing returns a `Byte`:

```white
let text -> String = "香蕉Banana🍌";
print(text.length()); // 8

let first -> Byte = text[0];
let chinese -> Char = text.char_at(1)?;
catch(err) { return 1; }
```

Looking up the nth Unicode scalar in UTF-8 requires a scan, so White does not
hide that cost behind `text[index]`. Code which needs scalar operations can use
`char_at`, `char_count`, `is_char_boundary`, and `is_valid_utf8` explicitly.

Array, vector, and string ranges are left-closed and right-open. A normal slice
copies its element storage; `ref` creates a shared view and keeps the backing
storage alive.

## Native boundaries stay explicit

White can declare functions using the C or system ABI and can build shared
libraries. Raw pointers, `AnyPtr`, and `extern` declarations remain unsafe
boundaries. The compiler cannot verify that a native signature matches the
library behind it.

Windows programs use native system APIs for startup, allocation, files,
processes, and console I/O rather than linking MSVCRT or UCRT. Linux and macOS
use their platform libc and POSIX interfaces. Both choices are deliberate; the
language does not pretend every operating system has the same native boundary.

## What is available now

The current compiler includes:

- arrays, vectors, slices, enums, structs, classes, inheritance, and interfaces;
- first-class functions, bound methods, and closures;
- fallible functions and user-defined error domains;
- modules, packages, private symbols, and controlled wildcard imports;
- C and system ABI declarations, native library search paths, and shared-library exports;
- standard packages for strings, files, processes, environment access, standard I/O, dictionaries, and JSON;
- Windows, Linux, and macOS targets across the architectures listed on the [download page](/download).

That list describes implemented language surface, not production maturity.
Generics are still limited, `Dict` is not yet a general-purpose generic map,
ARC cannot collect cycles, and networking, threads, asynchronous I/O, and a
complete filesystem package are still missing.

White is currently suited to compiler work, experiments, and small native
programs. Code which depends on a stable ABI or a mature standard library
should wait for later releases.

The [main repository](https://github.com/whitelanguage/white) contains the
compiler, standard library, tests, bootstrap notes, and the current list of
known limitations.
