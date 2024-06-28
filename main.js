const electron = require('electron')
const { ipcMain } = require('electron/main')
const fs = require('fs')
const os = require('os')
const path = require('path')
const app = electron.app
const BrowserWindow = electron.BrowserWindow


let mainWindow

function createWindow () {

  mainWindow = new BrowserWindow({
    width: 800,
  height: 600,
    minHeight: 500,
    minWidth: 950,
    webPreferences:{
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.resolve(__dirname,"preload.js")
    }
  })

  mainWindow.menuBarVisible = false; //? To access dev tools and other config in menu, set to true
  mainWindow.loadFile(`${__dirname}/dist/hibounote/browser/index.html`)

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

ipcMain.on('openLink',(event,link) => {
  electron.shell.openExternal(link);
})

ipcMain.on('saveBoard',(event, jsonValue)=>{
  const boardId = JSON.parse(jsonValue).id;

  if(!fs.existsSync(`${os.homedir()}/hibounote/data`)) {
    console.log("Dont exist")
    fs.mkdirSync(path.join(os.homedir(),'hibounote'),(err)=>{
      if(err) {
        console.log(err)
        return;
      }
      console.log('hibounote dir created')
    })

    fs.mkdirSync(path.join(os.homedir(),'hibounote','data'),(err)=>{
      if(err) {
        console.log(err)
        return;
      }
      console.log('data dir created')
    })
  }


  fs.writeFileSync(`${os.homedir()}/hibounote/data/board-${boardId.substring(0,8)}.json`,jsonValue,(err)=>{
    if(err) {console.log(err)}
  })
})

function readFiles() {
  return new Promise((resolve, reject) => {

    fs.readdir(path.join(os.homedir(),'hibounote','data'),
      (err,files)=>{
        let boards = [];
        files.forEach(file=>{
          const data = fs.readFileSync(path.join(os.homedir(),'hibounote','data',file),{encoding:'utf-8'})
          boards.push(JSON.parse(data));
        })
        resolve(JSON.stringify(boards));
      }
    )
  })
}

ipcMain.handle('getBoards', async ()=>{
  if(!fs.existsSync(`${os.homedir()}/hibounote/data`)) return;
  return await readFiles()
  .then((data)=>{
    return data;
  })

  .catch((err)=>{
    console.log("ERROR: ",err)
    return err;
  })

})

ipcMain.on('deleteBoard',(event, id)=>{
  console.log('DELETE BOARD (board data)')
  const boardId = id.substring(0,8)
  console.log(boardId)
  if(fs.existsSync(path.join(os.homedir(),'hibounote','data',`board-${boardId}.json`))) {
    fs.unlinkSync(path.join(os.homedir(),'hibounote','data',`board-${boardId}.json`))
  }
})

app.on('ready', createWindow)
