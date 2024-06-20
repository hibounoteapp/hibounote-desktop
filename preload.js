const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld('electron',{
  saveInDevice: (value)=>ipcRenderer.send('saveBoards',value),
  getInDevice: async ()=> await ipcRenderer.invoke("getBoards"),
});

document.addEventListener('DOMContentLoaded',()=>{

  // let saveButton = document.getElementById("saveToFileSystem")

  // fs.readFile('C://Gustavo/fileExample.txt',(err,data)=>{
  //   console.log(data,err)

  //   saveButton.innerText = data;
  // })

  // saveButton.addEventListener('click',()=>{
  //   ipcRenderer.send('saveBoards',board)
  // })
});

