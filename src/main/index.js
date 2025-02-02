import { app, ipcMain } from 'electron';
import { createMainWindow } from './windows.js';
import { writeFile, readFile } from 'fs';
import { fileURLToPath } from 'node:url';
import createMenu from './menu.js';
import path from 'node:path';

export let mainWindow;

/* ----------------------------- Create Windows ----------------------------- */
app.whenReady().then(() => {
  mainWindow = createMainWindow();
  createMenu();
});

/* -------------------------------------------------------------------------- */
/*                                Communication                               */
/* -------------------------------------------------------------------------- */



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = `${__dirname}/config.json`;

/* -------------------------------------------------------------------------- */
/*                                 Load Theme                                 */
/* -------------------------------------------------------------------------- */

ipcMain.on('editor-ready', () => {
  readFile(filePath, 'utf-8', (err, data) => {
      const config = JSON.parse(data);
      const theme = config.theme;
      console.log('Loaded theme:', theme);

      mainWindow.webContents.send('load-theme', theme);
  });
});

/* -------------------------------------------------------------------------- */
/*                                 Save Theme                                 */
/* -------------------------------------------------------------------------- */

ipcMain.on('save-theme', (event, theme) => {
  const config = { theme };
  
  writeFile(filePath, JSON.stringify(config, null, 2), (err) => {
      if (!err) {
          console.log('Theme saved successfully!');
      }
  });
});