const { app, BrowserWindow, Menu } = require('electron');
const { close } = require('./app');

// Create a new Electron window
function createWindow() {
  const win = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1200,
    height: 600,
    icon: './icon.png',
    webPreferences: {
      devTools: false,
      
      }
  });
  win.removeMenu();
  // Load your application's HTML file
  win.loadURL(`http://localhost:4000`);
  //win.webContents.openDevTools();
}
Menu.setApplicationMenu(null);
// When Electron has finished initializing
app.whenReady().then(() => {

  createWindow();

  // Close the server when Electron is quitting
  app.on('quit', () => {
    close();
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

