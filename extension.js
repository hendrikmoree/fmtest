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
        for (let i = linesBefore.length - 1; i >= 0; --i) {
            if (linesBefore[i].startsWith('    fmtest') && lineNrTest === null) {
                lineNrTest = i
            }
            if (linesBefore[i].startsWith('experiment') && lineNrExp === null) {
                lineNrExp = i
            }
        }

        if (lineNrExp === null && lineNrTest === null) return

        editor.edit((editBuilder) => {

            let lineNr
            let newLine
            if (lineNrTest === null) {
                newLine = lines[lineNrExp]
                if (newLine.indexOf('experiment.only') > -1) {
                    newLine = newLine.replace('experiment.only', 'experiment')
                } else {
                    newLine = newLine.replace('experiment', 'experiment.only')
                }
                lineNr = lineNrExp
            } else {
                newLine = lines[lineNrTest]
                if (newLine.indexOf('fmtest.only') > -1) {
                    newLine = newLine.replace('fmtest.only', 'fmtest')
                } else {
                    newLine = newLine.replace('fmtest', 'fmtest.only')
                }
                lineNr = lineNrTest
            }

            editBuilder.replace(new vscode.Range(lineNr, 0, lineNr, 1000), newLine)
        })
    })
}

// this method is called when your extension is deactivated
exports.deactivate = () => {
}

