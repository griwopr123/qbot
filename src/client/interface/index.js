const {app, BrowserWindow} = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 900,
        height: 550,
    })
    win.loadFile('src/client/interface/index.html');
}

app.whenReady().then(() => createWindow())
app.on('window-all-closed', () => app.quit)