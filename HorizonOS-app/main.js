const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { SerialPort } = require('serialport');

let mainWindow;
let currentPort;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('list-ports', async () => {
  try {
    const ports = await SerialPort.list(); // works in all modern versions
    console.log("Found ports:", ports);
    return ports.map(p => p.path);
  } catch (err) {
    console.error("Error listing ports:", err);
    return [];
  }
});

// Start serial monitoring on selected port
ipcMain.handle('start-serial', (event, portPath) => {
  if (currentPort) {
    currentPort.close();
    currentPort = null;
  }

  
  currentPort = new SerialPort({
    path: portPath,
    baudRate: 9600,
  });

  currentPort.on('data', data => {
    // Send data to renderer via IPC
    mainWindow.webContents.send('serial-data', data.toString());
  });

  currentPort.on('error', err => {
    mainWindow.webContents.send('serial-error', err.message);
  });
});

// Stop serial monitoring
ipcMain.handle('stop-serial', () => {
  if (currentPort) {
    currentPort.close();
    currentPort = null;
  }
});