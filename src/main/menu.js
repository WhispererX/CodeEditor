import { Menu, BrowserWindow , ipcMain} from 'electron';
import { mainWindow } from './index.js';

export default function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'New File', accelerator: 'CmdOrCtrl+N', click: () => mainWindow.webContents.send('new-file')},
        { label: 'Open File', accelerator: 'CmdOrCtrl+O', click: () => mainWindow.webContents.send('open-file') },
        { label: 'Open Folder', accelerator: 'Shift+CmdOrCtrl+O', click: () => mainWindow.webContents.send('open-folder')},
        { type: 'separator' },
        { label: 'Save', accelerator: 'CmdOrCtrl+S', click: () => console.log('Save clicked') },
        { label: 'Save As', accelerator: 'Shift+CmdOrCtrl+S', click: () => mainWindow.webContents.send('save-all')},
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { label: 'Toggle Preview', accelerator: 'CmdOrCtrl+P', click: () => mainWindow.webContents.send('toggle-preview')},
      ],
    },
    {
      label: 'Theme',
      submenu: [
        {
          label: 'Default',
          click: () => {
            const window = BrowserWindow.getFocusedWindow();
            window.webContents.send('change-theme', 'default')
          },
        },
        {
          label: 'Material',
          submenu: [
            {
              label: 'Material',
              click: () => {
                const window = BrowserWindow.getFocusedWindow();
                window.webContents.send('change-theme', 'material')
              },
            },
            {
              label: 'Material Ocean',
              click: () => {
                const window = BrowserWindow.getFocusedWindow();
                window.webContents.send('change-theme', 'material-ocean')
              },
            },     
          ]  
        },
        {
          label: 'Dark',
          submenu: [
            {
              label: 'Lesser Dark',
              click: () => {
                const window = BrowserWindow.getFocusedWindow();
                window.webContents.send('change-theme', 'lesser-dark')
              },
            },
            {
              label: 'XQ Dark',
              click: () => {
                const window = BrowserWindow.getFocusedWindow();
                window.webContents.send('change-theme', 'xq-dark')
              },
            },
            {
              label: 'Duotone Dark',
              click: () => {
                const window = BrowserWindow.getFocusedWindow();
                window.webContents.send('change-theme', 'duotone-dark')
              },
            },
          ]
        },
        {
          label: 'Ambiance',
          click: () => {
            const window = BrowserWindow.getFocusedWindow();
            window.webContents.send('change-theme', 'ambiance')
          },
        },
        {
          label: 'Dracula',
          click: () => {
            const window = BrowserWindow.getFocusedWindow();
            window.webContents.send('change-theme', 'dracula')
          },
        },
        {
          label: 'Yonce',
          click: () => {
            const window = BrowserWindow.getFocusedWindow();
            window.webContents.send('change-theme', 'yonce')
          },
        },
        {
          label: 'The Matrix',
          click: () => {
            const window = BrowserWindow.getFocusedWindow();
            window.webContents.send('change-theme', 'the-matrix')
          },
        },
        {
          label: 'Night',
          submenu: [
            {
              label: '3024 Night',
              click: () => {
                const window = BrowserWindow.getFocusedWindow();
                window.webContents.send('change-theme', '3024-night')
              },
            },
            {
              label: 'Night',
              click: () => {
                const window = BrowserWindow.getFocusedWindow();
                window.webContents.send('change-theme', 'night')
              },
            },
          ]
        },
        {
          label: 'Ayu',
          submenu: [
            {
              label: 'Ayu Dark',
              click: () => {
                const window = BrowserWindow.getFocusedWindow();
                window.webContents.send('change-theme', 'ayu-dark')
              },
            },
            {
              label: 'Ayu Mirage',
              click: () => {
                const window = BrowserWindow.getFocusedWindow();
                window.webContents.send('change-theme', 'ayu-mirage')
              },
            },
          ]
        },
        {
          label: 'Blackboard',
          click: () => {
            const window = BrowserWindow.getFocusedWindow();
            window.webContents.send('change-theme', 'blackboard')
          },
        },
        {
          label: 'Cobalt',
          click: () => {
            const window = BrowserWindow.getFocusedWindow();
            window.webContents.send('change-theme', 'cobalt')
          },
        },
        {
          label: 'Isotope',
          click: () => {
            const window = BrowserWindow.getFocusedWindow();
            window.webContents.send('change-theme', 'isotope')
          },
        },
        {
          label: 'Moxer',
          click: () => {
            const window = BrowserWindow.getFocusedWindow();
            window.webContents.send('change-theme', 'moxer')
          },
        },
        {
          label: 'Nord',
          click: () => {
            const window = BrowserWindow.getFocusedWindow();
            window.webContents.send('change-theme', 'nord')
          },
        },
      ],
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}