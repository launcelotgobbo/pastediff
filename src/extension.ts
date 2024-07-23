import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel('PasteDiff');
    outputChannel.appendLine('PasteDiff extension is now active!');

    let disposable = vscode.commands.registerCommand('pastediff.compare', async () => {
        outputChannel.appendLine('PasteDiff command triggered');
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active text editor');
            outputChannel.appendLine('Error: No active text editor');
            return;
        }

        try {
            const document = editor.document;
            const selection = editor.selection;
            const selectedText = document.getText(selection);
            outputChannel.appendLine(`Selected text: ${selectedText}`);
            
            const clipboardText = await vscode.env.clipboard.readText();
            outputChannel.appendLine(`Clipboard text: ${clipboardText}`);

            if (selectedText === clipboardText) {
                vscode.window.showInformationMessage('No differences found between selected text and clipboard content');
                outputChannel.appendLine('No differences found');
                return;
            }

            // Create temporary files
            const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pastediff-'));
            const file1 = path.join(tmpDir, 'selected.txt');
            const file2 = path.join(tmpDir, 'clipboard.txt');

            fs.writeFileSync(file1, selectedText);
            fs.writeFileSync(file2, clipboardText);

            // Open diff view
            const uri1 = vscode.Uri.file(file1);
            const uri2 = vscode.Uri.file(file2);
            
            await vscode.commands.executeCommand('vscode.diff', uri1, uri2, 'Selected Text ↔ Clipboard');

            // Show side pop-up
            const response = await vscode.window.showInformationMessage(
                'Replace selected text with clipboard content?',
                { modal: false },
                'Yes', 'No'
            );

            // Close the diff view
            await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
            outputChannel.appendLine('Diff view closed');

            if (response === 'Yes') {
                const edit = new vscode.WorkspaceEdit();
                edit.replace(document.uri, selection, clipboardText);
                
                const success = await vscode.workspace.applyEdit(edit);
                if (success) {
                    vscode.window.showInformationMessage('Text replaced with clipboard content');
                    outputChannel.appendLine('Text replaced successfully');
                } else {
                    vscode.window.showErrorMessage('Failed to replace text');
                    outputChannel.appendLine('Error: Failed to replace text');
                }
            }

            // Clean up temporary files
            fs.unlinkSync(file1);
            fs.unlinkSync(file2);
            fs.rmdirSync(tmpDir);
            outputChannel.appendLine('Temporary files cleaned up');
        } catch (error) {
            vscode.window.showErrorMessage(`An error occurred: ${error}`);
            outputChannel.appendLine(`Error: ${error}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    if (outputChannel) {
        outputChannel.dispose();
    }
}