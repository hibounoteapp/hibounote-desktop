const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld('electron',{
  saveInDevice: (value)=>ipcRenderer.send('saveBoard',value),
  getInDevice: async ()=> await ipcRenderer.invoke("getBoards"),
  deleteBoard: (id)=>ipcRenderer.send('deleteBoard',id),
  deleteAll: ()=>ipcRenderer.send('deleteAll'),
  openLink: (link) => ipcRenderer.send('openLink',link)
});

