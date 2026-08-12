---
sidebar_position: 3
description: The compiler driver options used when building White programs.
---

# The wlc command

`wlc` (White Language Compiler) is both the White compiler frontend and the native build driver. Its
general command form is:

```text
wlc <source.wl> [native files...] [options]
```

The first positional argument is the White entry file. Other White source files
normally enter the program through `import`; native source, object, and library
inputs may be supplied to the link step as additional files.

Run `wlc --help` to see the options supported by the installed compiler. This
page describes the options used most often with White.

## Output names

Without `-o`, the output name is derived from the entry file:

| Build | Windows | Linux | macOS |
|---|---|---|---|
| executable | `hello.exe` | `hello` | `hello` |
| shared library | `hello.dll` | `libhello.so` | `libhello.dylib` |
| object | `hello.obj` | `hello.o` | `hello.o` |
| assembly | `hello.s` | `hello.s` | `hello.s` |

`-o <path>` overrides the complete output path. The driver does not append an
extension to an explicit name.

```bash
wlc src/main.wl -o build/app
```

Create the destination directory before compiling; `wlc` does not create
missing parent directories for `-o`.

## Optimization and debug information

The default optimization level is `-O2`.

```text
-O0    disable optimization; useful while inspecting generated code
-O1    enable light optimization
-O2    normal optimized build
-O3    enable more aggressive speed optimization
-Os    optimize for size
-Oz    optimize more aggressively for size
```

`-g` asks Clang to include source-level debug information. It may be combined
with any optimization level:

```bash
wlc main.wl -O0 -g
```

## Stop before linking

`-c` produces an object file without linking:

```bash
wlc library.wl -c
```

`-S` produces textual assembly:

```bash
wlc main.wl -S
```

Use `--emit-llvm` with `-S` for textual LLVM IR, or with `-c` for LLVM bitcode:

```bash
wlc main.wl -S --emit-llvm
wlc main.wl -c --emit-llvm
```

The default names are `main.ll` and `main.bc` respectively.

## Inspect the frontend

`--dump-ast` prints the parsed abstract syntax tree. `--dump-ir` prints the
generated LLVM IR. These are compiler-development options; their output format
is not a stable interface.

`--keep-temps` keeps the temporary `.ll` file used for an ordinary native
build. `-v` prints the build stages, selected backend program, and each argument
passed to it.

```bash
wlc main.wl -v --keep-temps
```

## Shared libraries

`--shared` builds a library instead of an executable:

```bash
wlc exports.wl --shared
```

On Windows, the driver also creates the matching import library beside the DLL.
An explicit output such as `-o math.dll` produces `math.lib`. Linux and macOS
use the usual `lib` prefix only when the output name is left to the driver.

Exported White entry points use `@ExportLib`. Native interoperability and ABI
rules are covered separately in the Language Guide.

## Native libraries

`-L <directory>` and `--library-path <directory>` add a directory to the
linker's library search path. The joined form is also accepted:

```bash
wlc app.wl -L ./native/lib
wlc app.wl -L./native/lib
```

An extern declaration with `in "name"` adds the corresponding `-lname` linker
argument. `--ldflags` passes additional linker arguments when the regular
library declarations and search paths are not enough:

```bash
wlc app.wl --ldflags "-pthread -lcustom"
```

Treat `--ldflags` as a native toolchain escape hatch. Flags accepted on one
linker may not exist on another platform.

## Targets and system roots

`--target <triple>` selects a supported target. Both forms below are valid:

```bash
wlc main.wl --target x86_64-unknown-linux-gnu
wlc main.wl --target=x86_64-unknown-linux-gnu
```

`wlc --target-help` prints the exact triples known by that compiler.
`--sysroot <directory>` supplies the headers and libraries of the selected
target to Clang. Selecting a triple is enough for LLVM IR, assembly, or object
generation; linking for another operating system also needs its SDK or system
root.

Cross-compilation is documented under **Compiler and Tools** because its setup
depends on the host and target pair.

## Exit status

`wlc` returns zero after a successful build and a non-zero status after a
frontend, backend, or linking failure. A normal successful build ends with:

```text
Build success: <output>
```

Scripts should use the process exit status rather than matching this text.
