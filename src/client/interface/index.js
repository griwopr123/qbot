const {app, BrowserWindow} = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 900,
        height: 550,
    })
    win.loadFile('src/client/interface/index.html');
    global.mainWindow = win;
}

app.whenReady().then(() => createWindow())
app.on('window-all-closed', () => app.quit)