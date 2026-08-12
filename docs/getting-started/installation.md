---
sidebar_position: 1
description: Install a White release and configure wlc.
---

# Installation

A White installation contains the compiler, standard library, and the native
tools used by the compiler driver. Start with a binary release unless you are
working on `wlc` itself; rebuilding the compiler requires an existing White
toolchain.

## Download a release

The [download page](/download) lists the packages currently present on the
public mirror. Choose the package matching the operating system and
architecture on which `wlc` will run.

Windows releases use an installer. Linux and macOS releases are compressed
archives. After installation or extraction, the toolchain root has this form:

```text
WhiteLanguage/
├── bin/
│   ├── wlc
│   └── wlls
├── std/
└── tools/
    └── llvm/
```

Executable names have an `.exe` suffix on Windows. The bundled LLVM directory
contains the Clang toolchain used for native code generation and linking.

## Configure the environment

`WL_PATH` must point at the `WhiteLanguage` directory shown above. It must not
point at `bin`, `std`, or the compiler executable itself. Add
`WhiteLanguage/bin` to `PATH` so that `wlc` can be run outside the installation
directory.

For the current PowerShell session:

```powershell
$env:WL_PATH = "C:\path\to\WhiteLanguage"
$env:Path = "$env:WL_PATH\bin;$env:Path"
```

For the current Bash, Zsh, or compatible shell session:

```bash
export WL_PATH="$HOME/path/to/WhiteLanguage"
export PATH="$WL_PATH/bin:$PATH"
```

Add the same assignments through the normal environment settings for your
operating system or shell if they should survive a new terminal session. The
Windows installer will automatically do this; open a new terminal before
checking it.

## Check the installation

Run:

```bash
wlc --help
```

The first line should contain the installed compiler version, followed by the
driver options. To check the standard-library path as well, compile this file:

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

Run `check.exe` on Windows or `./check` on Linux and macOS. A successful build
confirms that `wlc`, the standard library, and the backend toolchain can all be
found.

## Common setup failures

`Missing 'WL_PATH' variable.` means that the variable was not visible to the
terminal which started `wlc`. Set it in that session or restart the terminal
after changing the system environment.

An error which names a missing standard-library module usually means that
`WL_PATH` points one directory too high or too low. The directory stored in the
variable should contain `std` directly.

If `wlc` cannot start Clang, first check for `tools/llvm/bin/clang` inside the
installation. When the bundled toolchain is absent, the driver falls back to a
system `clang` available through `PATH`.

On Linux and macOS, an archive may lose executable permissions depending on how
it was unpacked. Restore them on the compiler and bundled Clang if the shell
reports `Permission denied`:

```bash
chmod +x "$WL_PATH/bin/wlc" "$WL_PATH/tools/llvm/bin/clang"
```

Installations copied from another machine should keep `bin`, `std`, and
`tools/llvm` together. Copying only `wlc` is not a complete toolchain.
