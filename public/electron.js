const { app, BrowserWindow, ipcMain, dialog, Notification } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
function createWindow() {
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    })

  // Handle the 'toMain' event
  ipcMain.on('toMain', (event, arg) => {
    // Use the dialog to prompt the user for a save location
    dialog
      .showSaveDialog({
        title: 'Save your file',
        defaultPath: path.join(app.getPath('documents'), 'output.txt'),
        filters: [{ name: 'Text Files', extensions: ['txt'] }],
      })
      .then(({ filePath }) => {
        if (filePath) {
          // Write the content to the selected location
          fs.writeFile(filePath, arg.content, (err) => {
            if (err) {
              console.error('Failed to write file:', err)
              event.reply('fromMain', 'Error saving file')
              return
            }
            // Send a notification that the file was saved successfully
            const notification = new Notification({
              title: 'File Saved',
              body: 'Your file has been saved successfully.',
            })

            notification.show() // Show the notification
            event.reply('fromMain', 'File saved successfully')
            console.log('File saved at:', filePath)
          })
        }
      })
      .catch((err) => {
        console.error('Save dialog error:', err)
        event.reply('fromMain', 'Save canceled')
      })
  })

  console.log('Loading URL:', startUrl) // Log the URL being loaded

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true, // Enabling context isolation for security
      nodeIntegration: false, // Disable node integration to improve security
      preload: path.join(__dirname, 'preload.js'), // Preload script path
    },
  })

  // Open DevTools if needed for debugging
  // win.webContents.openDevTools();

  win.loadURL(startUrl).catch((err) => {
    console.error('Failed to load URL:', err) // Log errors if loading fails
  })

  win.on('closed', () => {
    console.log('Window closed') // Log when the window is closed
  })
}

app.whenReady().then(() => {
  createWindow()

  // macOS: Reactivate app when clicking the dock icon
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
