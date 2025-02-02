
const textarea = document.getElementById('codeEditor');
const filesContainer = document.getElementById('files');
const folder = document.getElementById('Folder');

let activeFile = null;
let fileContents = new Map();

//#region Seting Up Code Editor
export const editor = CodeMirror.fromTextArea(textarea, {
    lineNumbers: true,
    mode: 'javascript',
    theme: 'ambiance',
    matchBrackets: true,
    matchTags: true,
    autoCloseBrackets: true,
    autoCloseTags: true,
    styleActiveLine: true,
    foldGutter: true,
    
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
});

editor.setSize('calc(100% - 200px)', '100vh')

editor.setOption("extraKeys", {
    "Ctrl-Space": "autocomplete",
    //#region Commenting
    "Ctrl-K": function (cm) {
            cm.execCommand("toggleComment");
        },
    "Ctrl-/": function (cm) {
            cm.execCommand("toggleComment");
        }
    //#endregion
});

// Signal that rendered is initialized
window.electron.send('editor-ready');
//#endregion

//#region Manage Themes
// Change Theme
window.electron.receive('change-theme', (theme) => {
    editor.setOption('theme', theme);
    window.electron.send('save-theme', theme );
});

// Load Theme
window.electron.receive('load-theme', (theme) => {
    editor.setOption('theme', theme);
});
//#endregion

//#region  Drag & Drop Files
// Use the CodeMirror wrapper element for drag events
const editorWrapper = editor.getWrapperElement();

// Dragover event
editorWrapper.addEventListener('dragover', (event) => {
    event.preventDefault(); // Prevent default behavior
    editorWrapper.classList.add('drag-over'); // Add class for styling
});

// Dragleave event
editorWrapper.addEventListener('dragleave', () => {
    editorWrapper.classList.remove('drag-over'); // Remove class for styling
});

// Drop event
editorWrapper.addEventListener('drop', async (event) => {
    event.preventDefault(); // Prevent default behavior
    editorWrapper.classList.remove('drag-over'); // Clean up styling

    const items = event.dataTransfer.items; // Get the dropped items

    // Loop through the items
    for (const item of items) {
        if (item.kind === 'file') {
            const file = item.getAsFile(); // Get the file

            if (file) {
                const fileName = file.name;

                // Check if the file is an HTML file
                if (fileName.endsWith('.html')) {
                    // Open the HTML file in a new tab
                    const fileUrl = URL.createObjectURL(file);
                    window.open(fileUrl, '_blank');
                } else {
                    // Check if the file extension is valid
                    if (
                        file.type === 'text/plain' ||
                        fileName.endsWith('.js') ||
                        fileName.endsWith('.css') ||
                        fileName.endsWith('.py') ||
                        fileName.endsWith('.java') ||
                        fileName.endsWith('.cpp') ||
                        fileName.endsWith('.c') ||
                        fileName.endsWith('.json') ||
                        fileName.endsWith('.md') ||
                        fileName.endsWith('.xml') ||
                        fileName.endsWith('.sql') ||
                        fileName.endsWith('.php') ||
                        fileName.endsWith('.rb') ||
                        fileName.endsWith('.go') ||
                        fileName.endsWith('.rust') ||
                        fileName.endsWith('.swift') ||
                        fileName.endsWith('.kt') ||
                        fileName.endsWith('.scala') ||
                        fileName.endsWith('.r') ||
                        fileName.endsWith('.sh') ||
                        fileName.endsWith('.bat') ||
                        fileName.endsWith('.ps1') ||
                        fileName.endsWith('.yaml') ||
                        fileName.endsWith('.toml') ||
                        fileName.endsWith('.ini') ||
                        fileName.endsWith('.cfg') ||
                        fileName.endsWith('.log')
                    ) {
                        const content = await file.text();
                        const fileElement = createFileElement(fileName, content);
                        filesContainer.appendChild(fileElement);
                        editor.setValue(content);
                        fileContents.set(fileName, content); 
                    }
                }
            }
        } else {
            event.preventDefault();
        }
    }
});
//#endregion

//#region Get mode from extension function
const modeMap = {
    'js': 'javascript',
    'py': 'python',
    'html': 'htmlmixed',
    'css': 'css',
    'java': 'text/x-java',
    'cpp': 'text/x-c++src',
    'c': 'text/x-csrc',
    'ts': 'javascript',
    'json': 'application/json',
    'md': 'markdown',
    'xml': 'application/xml',
    'sql': 'text/x-sql',
    'php': 'php',
    'rb': 'ruby',
    'go': 'go',
    'rust': 'rust',
    'swift': 'swift',
    'kt': 'text/x-kotlin',
    'scala': 'text/x-scala',
    'r': 'r',
    'sh': 'shell',
    'bat': 'shell',
    'ps1': 'powershell',
    'yaml': 'yaml',
    'toml': 'toml',
    'ini': 'ini',
    'cfg': 'ini',
    'log': 'text'
};
function getModeFromExtension(extension) {
    return modeMap[extension.toLowerCase()] || 'text';
}
//#endregion

//#region Save code to file elements
editor.on('change', () => {
    updateFileContent();
    
    var previewFrame = document.getElementById('preview');
    var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
    preview.open();
    preview.write(editor.getValue());
    preview.close();
      
});

window.electron.receive('toggle-preview', () => {
    const preview = document.getElementById('preview-wrapper');
    const isEnabled = preview.style.display === 'flex';

    preview.style.display = isEnabled ? 'none' : 'flex';
});

function updateFileContent() {
    if (filesContainer.children.length === 0) {
        toggleModal('createFileModal', true);
    } else if (activeFile) {
        fileContents.set(activeFile.innerText, editor.getValue());
    }
}
//#endregion

//#region  Menu Bar Buttons
/* -------------------------- Menu Bar Create File -------------------------- */
window.electron.receive('new-file', () => {
    toggleModal('createFileModal', true);
});

/* -------------------------- Menu Bar Open Folder -------------------------- */
window.electron.receive('open-folder', async () => {
    const directoryFolder = await window.showDirectoryPicker();
    if (directoryFolder) {
        filesContainer.innerHTML = '';
        folder.innerText = `▾ ${directoryFolder.name}`;
        filesContainer.style.display = 'block';
        for await (const [name, handle] of directoryFolder.entries()) {
            if (handle.kind === 'file' && /\.(txt|js|html|css|py|java|cpp|c|ts|json|md|xml|sql|php|rb|go|rust|swift|kt|scala|r|sh|bat|ps1|yaml|toml|ini|cfg|log)$/.test(name)) {
                const file = await handle.getFile();
                const content = await file.text();

                createFile(name, content);
            }
        }
    }
});

/* --------------------------- Menu Bar Open File --------------------------- */
window.electron.receive('open-file', async () => {
    try {
        const [fileHandle] = await window.showOpenFilePicker({
            types: [
                {
                    description: 'Code Files',
                    accept: { 'text/*': Object.keys(modeMap).map(ext => `.${ext}`) }
                }
            ]
        });

        const file = await fileHandle.getFile();
        const content = await file.text();
        const fileName = file.name;

        createFile(fileName, content);
    } catch (error) {
        
    }
});

/* -------------------------- Menu Bar Save Project ------------------------- */
window.electron.receive('save-all', async () => {
    const folderHandle = await window.showDirectoryPicker();
        for (const [fileName, content] of fileContents.entries()) {
            const fileHandle = await folderHandle.getFileHandle(fileName, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(content);
            await writable.close();
        }
});
//#endregion

// Create File
document.getElementById('createFile').addEventListener('click', () => {
    toggleModal('createFileModal', true)
})

// Open a file
document.getElementById('openFile').addEventListener('click', async () => {
    try {
        const [fileHandle] = await window.showOpenFilePicker({
            types: [
                {
                    description: 'Code Files',
                    accept: { 'text/*': Object.keys(modeMap).map(ext => `.${ext}`) }
                }
            ]
        });

        const file = await fileHandle.getFile();
        const content = await file.text();
        const fileName = file.name;

        createFile(fileName, content);

    } catch (error) {
        
    }
});

// Open a folder
document.getElementById('openFolder').addEventListener('click', async () => {
    try {
        const directoryHandle = await window.showDirectoryPicker();
        if (directoryHandle) {
            filesContainer.innerHTML = '';

            folder.innerText = `▾ ${directoryHandle.name}`;
            filesContainer.style.display = 'block';

            for await (const [name, handle] of directoryHandle.entries()) {
                if (handle.kind === 'file' && /\.(txt|js|html|css|py|java|cpp|c|ts|json|md|xml|sql|php|rb|go|rust|swift|kt|scala|r|sh|bat|ps1|yaml|toml|ini|cfg|log)$/.test(name)) {
                    const file = await handle.getFile();
                    const content = await file.text();

                    createFile(name, content);
                }
            }
        }
    } catch (error) {
        
    }
});



 /* ---------- Rename file on F2 or delete file on Delete key press ---------- */
 document.addEventListener('keydown', (e) => {
    if (activeFile) {
        if (e.key === 'F2') toggleModal('renameFileModal', true);
        else if (e.key === 'Delete') deleteFile();
    }
});

 /* ------------------------- Create new file element ------------------------ */
function createFile(name, content) {
    const file = document.createElement('div');
    file.className = 'file';
    file.innerText = name;
    file.draggable = true;
    file.id = Math.random().toString(36).substr(2, 9);
    filesContainer.appendChild(file);

    

    fileContents.set(name, content);

    if (activeFile) activeFile.classList.remove('active');
    activeFile = file;
    activeFile.classList.add('active');

    editor.setValue(content || fileContents.get(name) || '');

    const extension = name.split('.').pop();
    const mode = getModeFromExtension(extension);
    editor.setOption('mode', mode);

    file.classList.add(extension || 'txt')

    file.addEventListener('click', () => {
        if (activeFile) activeFile.classList.remove('active');
        activeFile = file;
        activeFile.classList.add('active');

        editor.setValue(content || fileContents.get(name) || '');

        const extension = name.split('.').pop();
        const mode = getModeFromExtension(extension);
        editor.setOption('mode', mode);
    })
}

 /* ------------------------------- Delete file ------------------------------ */
function deleteFile() {
    if (activeFile) {
        fileContents.delete(activeFile.innerText);
        activeFile.remove();
        activeFile = null;
    }
}

 /* ------------------------------ Rename folder ----------------------------- */
function renameFolder(name) {
    folder.innerText = '▸ ' + name;
}

 /* ----------------------------- Duplicate file ----------------------------- */
function duplicateFile() {
    if (activeFile){
        const originalFileName = activeFile.innerText;
        const originalContent = fileContents.get(originalFileName);

        let newFileName = originalFileName;
        let counter = 1;
        while (fileContents.has(newFileName)) {
            newFileName = originalFileName.replace(/(\.\w+)$/, `_${counter}$1`);
        }
        createFile(newFileName, originalContent);
    }
}

 /* -------------------------------- Copy file ------------------------------- */
function copyFile() {
    if (activeFile) {
        navigator.clipboard.writeText(fileContents.get(activeFile.innerText));
    }
}

 /* ------------------------------- Rename file ------------------------------ */
function renameFile(name) {
    const content = fileContents.get(activeFile.innerText);
    fileContents.delete(activeFile.innerText);
    activeFile.innerText = name;
    fileContents.set(name, content);

    const extension = name.split('.').pop();
    const mode = getModeFromExtension(extension);
    editor.setOption('mode', mode);
}

/* -------------------------------------------------------------------------- */
/*                        Drag-and-drop file reordering                       */
/* -------------------------------------------------------------------------- */
filesContainer.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.id);
});
filesContainer.addEventListener('dragover', (e) => e.preventDefault());
filesContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text');
    const draggedElement = document.getElementById(draggedId);
    filesContainer.insertBefore(draggedElement, e.target.nextSibling);
});
/* ----------------------------------- ... ---------------------------------- */

//#region  Modals
export function toggleModal(modalId, enable) {
    document.getElementById(modalId).style.display = enable ? 'flex' : 'none';
    editor.setOption('readOnly', enable);
}

/* ---------------------------- Rename File Modal --------------------------- */
document.getElementById('renameFileModalButton').addEventListener('click', () => {
    const fileName = document.getElementById('renameFileModalInput').value.trim();
    if (fileName) {
        const extension = fileName.split('.').pop();
        const mode = getModeFromExtension(extension);
        renameFile(`${fileName}${mode == 'text'? ".txt" : ""}`);
        toggleModal('renameFileModal', false);
    }
});

/* --------------------------- Rename Folder Modal -------------------------- */
document.getElementById('renameFolderModalButton').addEventListener('click', () => {
    const folderName = document.getElementById('renameFolderModalInput').value.trim();
    if (folderName) {
        renameFolder(folderName)
        toggleModal('renameFolderModal', false);
    }
});

/* ---------------------------- Create File Modal --------------------------- */
document.getElementById('createFileModalButton').addEventListener('click', () => {
    const newFileName = document.getElementById('createFileModalInput').value.trim();
    if (newFileName) {
        const extension = newFileName.split('.').pop();
        const mode = getModeFromExtension(extension)
        createFile(`${newFileName}${mode == 'text'? ".txt" : ""}`, '');
        toggleModal('createFileModal', false);
    }
});

/* ---------------------------- Close All Modals ---------------------------- */
document.getElementById('closeModal').addEventListener('click', () => {
    toggleModal('renameFileModal', false);
    toggleModal('renameFolderModal', false);
    toggleModal('createFileModal', false);
});
//#endregion

//#region Buttons
document.getElementById('renameFolder').onclick = () => {
    toggleModal('renameFolderModal', true)
  };
  
  document.getElementById('renameFile').onclick = () => {
    toggleModal('renameFileModal', true)
  };
  
  document.getElementById('copyFile').onclick = () => {
    copyFile();
  };
  
  document.getElementById('duplicateFile').onclick = () => {
    duplicateFile();
  };
  
  document.getElementById('deleteFile').onclick = () => {
    deleteFile();
  };
  
  document.getElementById('createFileBtn').onclick = () => {
    toggleModal('createFileModal', true)
  };
  
  document.getElementById('openFileBtn').onclick = () => {
    toggleModal('openFileModal', true)
  };
  
  document.getElementById('openFolderBtn').onclick = () => {
    toggleModal('openFolderModal', true)
  };
  
  
//#endregion
