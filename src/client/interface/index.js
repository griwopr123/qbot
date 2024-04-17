const {app, BrowserWindow} = require('electron');
const { ipcMain } = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 900,
        height: 550,
    })
    win.loadFile('src/client/interface/index.html');
    ipcMain.on('updateCoordinates', (event, args) => {
        console.log(`Получены новые координаты: ${args.x}, ${args.y}, ${args.z}`);
        // Здесь вы можете обновить пользовательский интерфейс с полученными координатами (например, отобразить в метке)
    });
}

app.whenReady().then(() => createWindow())
app.on('window-all-closed', () => app.quit)