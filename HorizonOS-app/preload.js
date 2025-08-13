const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  listPorts: () => ipcRenderer.invoke('list-ports'),
  startSerial: (port) => ipcRenderer.invoke('start-serial', port),
  stopSerial: () => ipcRenderer.invoke('stop-serial'),
  onSerialData: (callback) => ipcRenderer.on('serial-data', (event, data) => callback(data)),
  onSerialError: (callback) => ipcRenderer.on('serial-error', (event, err) => callback(err))
});