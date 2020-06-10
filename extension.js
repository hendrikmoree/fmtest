'use strict';

const vscode = require('vscode');

const window = vscode.window;
const workspace = vscode.workspace;

exports.activate = (context) => {

    vscode.commands.registerTextEditorCommand('extension.toggleOnly', () => {
        const editor = window.activeTextEditor;
        if (!editor) {
            return;
        }

        if (!editor.document.fileName.endsWith('.spec.js')) {
            return;
        }

        const filedata = editor.document.getText();
        const location = editor.selection;

        const lines = filedata.split('\n')
        const linesBefore = lines.slice(0, location.start.line)

        let lineNr = null
        for (let i = linesBefore.length - 1; i >= 0; --i) {
            if (linesBefore[i].startsWith('    fmtest')) {
                lineNr = i
                break
            }
        }

        if (lineNr === null) return

        editor.edit((editBuilder) => {
            let newLine = lines[lineNr]
            if (newLine.indexOf('fmtest.only') > -1) {
                newLine = newLine.replace('fmtest.only', 'fmtest')
            } else {
                newLine = newLine.replace('fmtest', 'fmtest.only')
            }
            editBuilder.replace(new vscode.Range(lineNr, 0, lineNr, 1000), newLine)
        })
    })
}

// this method is called when your extension is deactivated
exports.deactivate = () => {
}

