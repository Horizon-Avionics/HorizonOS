const { contextBridge } = require("electron")

contextBridge.exposeInMainWorld("api", {
  hello: () => console.log("running HOS")
})