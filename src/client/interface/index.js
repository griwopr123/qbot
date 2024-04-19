const { app, BrowserWindow, ipcMain } = require('electron');
const WebSocket = require('ws');

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'src', 'client', 'interface', 'preload.js') // Изменяем путь к preload.js
        }
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
