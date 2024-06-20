const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld('electron',{
  saveInDevice: (value)=>ipcRenderer.send('saveBoards',value),
  getInDevice: async ()=> await ipcRenderer.invoke("getBoards"),
});

