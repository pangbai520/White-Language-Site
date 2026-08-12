---
sidebar_position: 1
description: An overview of White, its compiler, and the current state of the project.
---

# Introduction

White is a statically typed language which builds native executables and shared
libraries. Source files use the `.wl` extension. There is no virtual machine or
interpreter between a compiled White program and the operating system.

The compiler, `wlc`, is written in White. It parses and checks the program,
lowers it to LLVM IR, and invokes Clang for optimization, machine-code
generation, and linking. Release compilers are built by the preceding release;
the result then compiles the same source again as part of the bootstrap check.

White began as a compiler project rather than as a new syntax placed over an
existing language. Its implementation and standard library are therefore part
of the language design, not a separate reference implementation maintained
elsewhere.

## Design

White is intended to produce predictable native code without making ordinary
programs difficult to read. The compiler tries to reject unsafe states early:
values must be initialized, conditions must be `Bool`, fallible calls remain
visible at the call site, and incompatible numeric types are not silently
mixed.

That does not mean hiding every low-level detail. String indexing is
byte-oriented, native pointers and FFI remain unsafe boundaries, and ARC cannot
collect a cycle of strong references. Costs and limitations which matter to a
systems program should remain visible in the source or in the type system.

`Auto` is compile-time type inference rather than dynamic typing. Classes and
other managed values use atomic reference counting, while structs retain a
fixed value layout. These rules are covered in the Language Guide; the exact
cases accepted by the compiler belong in the Language Reference.

## From source to a program

A normal build has five stages:

```text
.wl source
    -> lexer and parser
    -> name and type checking
    -> LLVM IR
    -> Clang and the platform linker
    -> executable or shared library
```

The White frontend owns the language rules and the shape of the emitted IR.
LLVM and the platform toolchain handle optimization, instruction selection,
object files, and final linking. This split keeps the compiler small enough to
remain self-hosted without replacing a mature native backend.

## Project status

White can compile its own compiler and standard library. Current releases are
available for Windows, Linux, and macOS on the architectures listed on the
[download page](/download).

The project is still young. The generic type system is limited, ARC has no weak
references or cycle collector, the standard library is smaller than those of
established languages, and the internal White ABI may change between releases.
White is useful today for compiler work, language experiments, and small native
tools. Code which requires a stable ABI or a mature production ecosystem should
wait for a later release.

## Reading the documentation

Start with **Getting Started** to install the toolchain and build a first
program. **Language Guide** explains the features used in ordinary White code.
**Language Reference** records the precise grammar and semantic rules.
**Standard Library** documents the packages shipped with the toolchain, while
**Compiler and Tools** covers `wlc`, bootstrapping, cross-compilation, `wlls`,
and editor support.

Platform coverage, known limitations, and compatibility rules are kept under
**Project Status**. The [source repository](https://github.com/whitelanguage/white)
contains the compiler, standard library, tests, and bootstrap infrastructure.
