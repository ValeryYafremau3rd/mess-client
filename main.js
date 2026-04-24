const { app, BrowserWindow } = require("electron");
const path = require("path");
const serve = require("electron-serve").default;
const loadURL = serve({ directory: "dist" });

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Mess",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  loadURL(win);
}

app.on("ready", createWindow);
