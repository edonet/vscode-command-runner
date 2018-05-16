# VSCode Command Runner

Run custom shell command defined in vs code configuration and node module package.json

## Features

Run custom shell command

## Extension Settings

You can defined shell command in vs code configuration

```json
{
    "command-runner.commands": {
        "echo workspaceFolder": "echo ${workspaceFolder}",
        "echo file": "echo ${file}"
    }
}
```

or in node module package.json

```json
{
    "commands": {
        "echo workspaceFolder": "echo ${workspaceFolder}",
        "echo file": "echo ${file}"
    }
}
```

## Usages

* use shortcut `Ctrl+Shift+R`
* or press `F1` and then select/type `Run Command`,
* or right click the Text Editor and then click `Run Command` in editor context menu
