---
sidebar_position: 4
description: Arrange White source files, modules, packages, and build outputs.
---

# Project layout

White does not require a manifest for a small program. `wlc` starts from one
entry file and follows its imports, so a one-file project is simply:

```text
hello/
└── main.wl
```

Build it from the project directory:

```bash
wlc main.wl
```

The executable is written beside `main.wl` unless `-o` selects another path.
For a project which produces several files, keeping outputs in a separate
directory avoids mixing generated artifacts with source:

```bash
wlc src/main.wl -o build/app
```

The `build` directory must already exist.

## More than one source file

Local White files use an explicit `.wl` suffix in imports:

```text
hello/
├── main.wl
└── greeting.wl
```

```white title="greeting.wl"
func message(name -> String) -> String {
    return "hello, " + name;
}
```

```white title="main.wl"
import "greeting.wl"

func main() -> Int {
    print(greeting.message("White"));
    return 0;
}
```

An ordinary module import creates a namespace from the file name. Imports are
local to the source file which declares them: importing `greeting.wl` inside
another module does not make `greeting` visible everywhere else.

Paths are resolved from the importing file, not from whichever directory
happened to start `wlc`. This keeps a project working when the compiler is run
from another directory.

## Directory packages

A directory becomes a package by providing `_pkg.wl`. That file defines the
public shape of the package:

```text
hello/
├── main.wl
└── model/
    ├── _pkg.wl
    └── user.wl
```

```white title="model/user.wl"
class User {
    let name -> String;

    init(name -> String) {
        self.name = name;
    }
}
```

```white title="model/_pkg.wl"
import User from "user.wl"
```

```white title="main.wl"
import "model"

func main() -> Int {
    let user -> model.User = model.User("White");
    print(user.name);
    return 0;
}
```

Inside `_pkg.wl`, a named import re-exports that symbol through the package.
`import * from "file.wl"` re-exports all public symbols, while a normal
`import "file.wl"` preserves the child module namespace. Ordinary source files
do not re-export their own imports.

Names beginning with `__` are private and cannot be imported through a module
or package boundary.

## Standard-library imports

Standard packages and files are found under `WL_PATH/std` and omit the `.wl`
suffix:

```white
import "file"
import "json"
import "strings"
import "sys"
```

This differs from a local file import such as `import "parser.wl"`. The suffix
makes it clear that the path names a source file rather than a standard module
or directory package.

`builtin`, the standard `Error` type, and Dict support are connected to the
prelude. Code may use their unqualified names without an import. An explicit
`import "builtin"` is still valid when a qualified call such as
`builtin.print(...)` is wanted.

`std/internal` is reserved for the implementation of the standard library,
user projects cannot import it.
