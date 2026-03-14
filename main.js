const { app, BrowserWindow } = require("electron")
const path = require("path")

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  })
  win.maximize()
  win.loadFile("renderer/index.html")
}

app.whenReady().then(createWindow)