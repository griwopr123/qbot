const { app, BrowserWindow } = require('electron');
const WebSocket = require('ws');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 900,
        height: 550,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
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

app.whenReady().then(() => createWindow())
app.on('window-all-closed', () => app.quit)
