const { contextBridge, ipcRenderer } = require('electron')

// Expose an API to the renderer process
contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => {
    // Only allow certain channels to be used
    let validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel, func) => {
    let validChannels = ['fromMain']
    if (validChannels.includes(channel)) {
      // Remove default behavior to prevent memory leaks
      ipcRenderer.removeAllListeners(channel)
      // Listen for messages from the main process
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
})
