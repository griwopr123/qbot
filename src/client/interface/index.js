const { app, BrowserWindow, ipcMain } = require('electron');
const WebSocket = require('ws');
const { ipcRenderer } = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 900,
        height: 550,
    });
    win.loadFile('src/client/interface/index.html');
};

const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', ws => {
    ws.on('message', message => {
        console.log(`Received message: ${message}`);
    });
});
ipcMain.on('message-from-renderer', (event, arg) => {
    console.log(arg); // Выводим в консоль сообщение из рендерера
});
app.whenReady().then(() => createWindow())
app.on('window-all-closed', () => app.quit)
