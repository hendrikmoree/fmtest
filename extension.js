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
        const linesBefore = lines.slice(0, location.start.line + 1)

        let lineNrTest = null
        let lineNrExp = null
        let lineNrDesc = null
        for (let i = linesBefore.length - 1; i >= 0; --i) {
            if (linesBefore[i].startsWith('    fmtest') && lineNrTest === null) {
                lineNrTest = i
            }
            if (linesBefore[i].startsWith('experiment') && lineNrExp === null) {
                lineNrExp = i
            }
            if (linesBefore[i].startsWith('describe') && lineNrDesc === null) {
                lineNrDesc = i
            }
        }

        if (lineNrExp === null && lineNrTest === null && lineNrDesc === null) return

        editor.edit((editBuilder) => {

            const lineNr = Math.max(lineNrTest, lineNrExp, lineNrDesc)
            let newLine = lines[lineNr]

            let replace = 'fmtest'
            if (lineNr === lineNrExp) replace = 'experiment'
            if (lineNr === lineNrDesc) replace = 'describe'

            if (newLine.indexOf(`${replace}.only`) > -1) {
                newLine = newLine.replace(`${replace}.only`, replace)
            } else {
                newLine = newLine.replace(replace, `${replace}.only`)
            }

            editBuilder.replace(new vscode.Range(lineNr, 0, lineNr, 1000), newLine)
        })
    })
}

// this method is called when your extension is deactivated
exports.deactivate = () => {
}

