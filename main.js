const electron = require('electron')
const { ipcMain } = require('electron/main')
const fs = require('fs')
const { data } = require('jquery')
const path = require('path')
const app = electron.app
const BrowserWindow = electron.BrowserWindow


let mainWindow

function createWindow () {

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 500,
    minWidth: 790,
    webPreferences:{
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.resolve(__dirname,"preload.js")
    }
  })

  mainWindow.loadFile(`dist/hibounote/browser/index.html`)

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

ipcMain.on('saveBoards',(event, jsonValue)=>{
  fs.writeFile(`${__dirname}/data/boards.json`,jsonValue,(err)=>{
    console.log(jsonValue)
    if(!err) {
      console.log('File written');
      return;
    }

    console.log(err);
  })
})

function readFiles() {
  return new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/data/boards.json`,'utf8',(err, data)=>{
      if(!err) {
        resolve(data);
      }
      reject(err);
    })
  })
}

ipcMain.handle('getBoards', async ()=>{
  return await readFiles()
  .then((data)=>{
    return data;
  })

  .catch((err)=>{
    console.log("ERROR: ",err)
    return err;
  })

})

app.on('ready', createWindow)
