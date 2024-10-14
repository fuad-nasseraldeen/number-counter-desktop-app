import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Ensure preload.js is correctly referenced
      contextIsolation: true, // Enable context isolation for security
      enableRemoteModule: false, // Disable remote module for security
      nodeIntegration: false, // Disable node integration for security
    },
  })

  // Load the React production build index.html
  win.loadFile(path.join(__dirname, 'index.html'))

  // Open DevTools if needed for debugging
  // win.webContents.openDevTools();

  // Handle the file writing process when receiving the event from React
  ipcMain.on('toMain', async (event, { content }) => {
    const result = await dialog.showSaveDialog({
      title: 'Save text file',
      defaultPath: path.join(app.getPath('desktop'), 'result.txt'),
      buttonLabel: 'Save',
      filters: [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    })

    if (!result.canceled && result.filePath) {
      fs.writeFile(result.filePath, content, 'utf8', (err) => {
        if (err) {
          console.error('Failed to save the file!', err)
          return
        }
        console.log('File saved successfully.')
      })
    }
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
