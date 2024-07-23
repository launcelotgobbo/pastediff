# PasteDiff

PasteDiff is a Visual Studio Code extension that allows you to compare selected text with clipboard content and paste with a diff view.

## Features

- Compare selected text with clipboard content
- View differences in a side-by-side diff view
- Option to replace selected text with clipboard content
- Configurable auto-replace and diff view timeout

## Installation

1. Open Visual Studio Code
2. Press `Ctrl+P` to open the Quick Open dialog
3. Type `ext install pastediff` to find the extension
4. Click the `Install` button, then the `Enable` button

## Usage

You can invoke PasteDiff in three ways:

1. **Command Palette**: 
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Type "PasteDiff" and select "PasteDiff: Compare with Clipboard"

2. **Keyboard Shortcut**:
   - Press `Ctrl+Shift+V` (Windows/Linux) or `Cmd+Shift+V` (Mac)

3. **Context Menu**:
   - Select text in the editor
   - Right-click to open the context menu
   - Choose "PasteDiff: Compare with Clipboard"

To use PasteDiff:
1. Select the text you want to compare in your editor
2. Copy the text you want to compare against to your clipboard
3. Invoke PasteDiff using one of the methods above
4. A diff view will open showing the differences
5. Choose whether to replace the selected text with the clipboard content

## Configuration

This extension contributes the following settings:

* `pastediff.autoReplace`: Automatically replace text without showing confirmation dialog (default: false)
* `pastediff.diffViewTimeout`: Time (in milliseconds) to keep the diff view open before auto-closing (default: 5000)

## License

This project is licensed under the MIT License.