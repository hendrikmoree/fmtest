Clone in `~/.vscode/extensions`

Key bindings;
```
{
    "key": "cmd+ctrl+t",
    "command": "extension.toggleOnly"
}
```

Install:
```
npm install -g @vscode/vsce
npm i -g
vsce package
code --install-extension fmtest-0.0.1.vsix
```
