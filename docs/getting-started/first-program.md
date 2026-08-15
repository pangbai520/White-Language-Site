---
sidebar_position: 2
description: Build and run a small White program.
---

# First program

Create an empty directory and save the following file as `hello.wl`:

```white title="hello.wl"
func main() -> Int {
    print("hello, White");
    return 0;
}
```

Build it from that directory:

```bash
wlc hello.wl
```

On Windows, the output is `hello.exe`:

```powershell
.\hello.exe
```

On Linux and macOS, the output has no suffix:

```bash
./hello
```

The program prints:

```text
hello, White
```

## What the file contains

`main` is the entry point of an executable. It returns an `Int`; that value
becomes the process exit status. Returning zero conventionally means success.

```white
func main() -> Int {
```

`print` writes its arguments followed by a newline. It belongs to White's
prelude, so this program does not need an import for it.

```white
print("hello, White");
```

Statements end with a semicolon. Blocks use braces, and the closing brace does
not take another semicolon.

## Add a function

The next version keeps `main` small and constructs the message in a separate
function:

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

Parameters use `:` between the name and type. The arrow following the parameter
list is reserved for the return type. A declaration with an initializer may
omit its type when the compiler can infer it, as `message` does here. Writing
`let message: Auto = ...` is also valid when an explicit inferred type is
useful.

Compile the file again with the same command. `wlc` replaces the previous
output after the build succeeds.

## Choose another output name

Use `-o` when the executable should not be named after the source file:

```bash
wlc hello.wl -o greeting
```

On Windows, include the intended suffix:

```powershell
wlc hello.wl -o greeting.exe
```

`wlc` reports compiler errors with the source file, line, column, and the part
of the line which caused the problem. A failed frontend check does not proceed
to native code generation or replace a successful output from an earlier
build.
