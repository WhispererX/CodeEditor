import { editor } from "./editor.js";


const snippetsByMode = {
    javascript: {
        "if": {
            name: "If",
            template: 'if (condition) {\n\t\n};'
        },
        "ifElse": {
            name: "If Else",
            template: 'if (condition) {\n\t\n} else {\n\t\n};'
        },
        "for": {
            name: "For Loop",
            template: "for (let i = 0; i < condition; i++) {\n\t\n}"
        },
        "while": {
            name: "While Loop",
            template: "while (condition) {\n\t\n}"
        },
        "console": {
            name: "Console Log",
            template: 'console.log("");'
        },
        "import": {
            name: "Import",
            template: "import { object } from 'path';"
        },
    },
    html: {
        "htmlDoc": {
            name: "HTML Doc",
            template: "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n\t<meta charset=\"UTF-8\">\n\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\t<title>Document</title>\n</head>\n<body>\n\n</body>\n</html>"
        },
        "scriptTag": {
            name: "Script",
            template: '<script src=""></script>'
        },
        "linkTag": {
            name: "Link",
            template: '<link rel="stylesheet" href="">'
        },
    },
    css: {
        "class": {
            name: "Class",
            template: ".className {\n\t\n}"
        },
        "id": {
            name: "ID",
            template: "#idName {\n\t\n}"
        }
    }
};

// General function to insert snippets
function insertSnippet(text) {
    const cursor = editor.getCursor();
    editor.replaceRange(text, cursor);
    editor.focus(); // Keep focus on the editor after insertion
}

// Register the hint helper to detect the active mode
Object.keys(snippetsByMode).forEach(mode => {
    CodeMirror.registerHelper("hint", mode, function (editor, options) {
        const snippets = snippetsByMode[mode];

        const suggestions = Object.keys(snippets).map(key => ({
            text: snippets[key].template.replace(/\${\d+}/g, ""),
            displayText: snippets[key].name
        }));

        const cursor = editor.getCursor();
        const token = editor.getTokenAt(cursor);

        return {
            list: suggestions,
            from: CodeMirror.Pos(cursor.line, token.start),
            to: CodeMirror.Pos(cursor.line, token.end)
        };
    });
});

// Auto-insert snippets based on user input
editor.on("inputRead", function (editor, change) {
    const mode = editor.getOption("mode");
    const snippets = snippetsByMode[mode] || {};
    const cursor = editor.getCursor();
    const line = editor.getLine(cursor.line);

    if ([" ", "\t"].includes(change.text[0])) {
        const token = editor.getTokenAt(cursor);
        const snippetKey = line.slice(token.start, token.end);

        if (snippets[snippetKey]) {
            const snippet = snippets[snippetKey].template;
            editor.replaceRange(snippet.replace(/\${\d+}/g, ""), { line: cursor.line, ch: token.start }, cursor);
            editor.setCursor(cursor.line, token.start + snippet.length);
        }
    }
});


/* -------------------------------------------------------------------------- */
/*                            Context Menu Snippets                           */
/* -------------------------------------------------------------------------- */

document.getElementById('snippetIf').onclick = () => {
    insertSnippet(`if (condition) {\n\t\n}`);
  };
  
  document.getElementById('snippetIfElse').onclick = () => {
    insertSnippet(`if (condition) {\n\t\n} else {\n\t\n}`);
  };
  
  document.getElementById('snippetFor').onclick = () => {
    insertSnippet(`for (let i = 0; i < condition; i++) {\n\t\n}`);
  };
  
  document.getElementById('snippetWhile').onclick = () => {
    insertSnippet(`while (condition) {\n\t\n}`);
  };
  
  document.getElementById('snippetImport').onclick = () => {
    insertSnippet(`import { object } from 'path';`);
  };
  
  document.getElementById('snippetDoc').onclick = () => {
    insertSnippet(`<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n\t<meta charset=\"UTF-8\">\n\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\t<title>Document</title>\n</head>\n<body>\n\n</body>\n</html>`);
  };
  
  document.getElementById('snippetScript').onclick = () => {
    insertSnippet(`<script src=""></script>`);
  };
  
  document.getElementById('snippetLink').onclick = () => {
    insertSnippet(`<link rel="stylesheet" href="">`);
  };
