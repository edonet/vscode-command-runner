# VSCode Command Runner

Run custom shell command defined in vs code configuration and node module package.json

## Features

* Run custom shell command
* Run selected content as shell command

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

## Key Binding
You can bind custom keys for the command which defined in configuration
```json
{
    "key": "ctrl+alt+1",
    "command": "command-runner.run",
    "args": { "command": "echo file" }
}
```

## Terminal Options
You can customize the terminal for the command
```json
{
    "key": "ctrl+alt+1",
    "command": "command-runner.run",
    "args": { "terminal": "terminalName" }
}
```
or
```json
{
    "key": "ctrl+alt+1",
    "command": "command-runner.run",
    "args": {
        "terminal": {
            "name": "terminalName",
            "cwd": "path/to/runCommand",
            "shellArgs": []
        }
    }
}
```

## Predefined Variable

* `${file}`: activated file path;
* `${fileBasename}`: activated file basename;
* `${fileBasenameNoExtension}`: activated file basename with no extension;
* `${fileDirname}`: activated file dirname;
* `${fileExtname}`: activated file extension;
* `${lineNumber}`: the first selected line number;
* `${lineNumbers}`: the all selected line number, eg. `41,46,80`;
* `${selectedText}`: the first selected text;
* `${selectedTextList}`: the all selected text list, eg. `sl1 sl2`;
* `${selectedPosition}`: the selected position list, eg. `21,6`;
* `${selectedPositionList}`: the all selected position list, eg. `45,6 80,18 82,5`;
* `${relativeFile}`: activated file relative path;
* `${workspaceFolder}`: activated workspace folder path;
* `${workspaceFolderBasename}`: activated workspace folder basename;
* `${homedir}`: the home directory of the current user;
* `${tmpdir}`: default directory for temporary files;
* `${env:PATH}`: shell environment variable "PATH";
* `${config:editor.fontSize}`: vscode config variable;
* `${command:workbench.action.terminal.clear}`: run vscode command;

## Usages

* use shortcut `Ctrl+Shift+R` to select custom command
* use shortcut `Ctrl+Alt+R` to run selected content as shell command
* or press `F1` and then select/type `Run Command` or `Run In Terminal`,
* or right click the Text Editor and then click `Run Command` to select custom command in editor context menu
* or right click the Text Editor and then click `Run In Terminal` to run selected content as shell command in editor context menu
