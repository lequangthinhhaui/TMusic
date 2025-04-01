// main.js (Electron Main Process)
// const { app, BrowserWindow, dialog, ipcMain } = require("electron");
// const path = require('path');
// const fs = require('fs');
// const { addTask, getTasks, deleteTask } = require("./database");

// let mainWindow;

// app.whenReady().then(() => {
//   mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//         preload: path.join(__dirname, "./preload.js"),
//         nodeIntegration: false,  // Prevent access to Node.js APIs in renderer
//         contextIsolation: true,  // Isolate context to prevent prototype pollution
//         webSecurity: true,       // Enforce security (prevents mixed-content attacks)
//         allowRunningInsecureContent: false, // Ensure no insecure content is loaded
//         allowFileAccess: true // Needed for playing local audio files
//     },
//   });
//   mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
//     callback({
//       responseHeaders: {
//         ...details.responseHeaders,
//         "Content-Security-Policy": ["default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' file: data:; media-src 'self' file: data:;"]
//       }
//     });
//   });
//   // mainWindow.loadURL("http://localhost:5173"); // React dev server
//   mainWindow.loadURL(`file://${path.join(__dirname, "../dist/index.html").replace(/\\/g, "/")}`);

//   mainWindow.on('closed', () => {
//     mainWindow = null;
//   });
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') app.quit();
// });

// app.on('activate', () => {
//   if (BrowserWindow.getAllWindows().length === 0) app.whenReady();
// });

// ipcMain.handle('select-folder', async () => {
//   const result = await dialog.showOpenDialog({
//     properties: ['openDirectory']
//   });

//   if (result.canceled || result.filePaths.length === 0) return [];
  
//   const folderPath = result.filePaths[0];
//   const audioExtensions = ['.mp3', '.wav', '.ogg'];
//   const audioFiles = fs.readdirSync(folderPath)
//     .filter(file => audioExtensions.includes(path.extname(file).toLowerCase()))
//     .map(file => `file://${path.join(folderPath, file).replace(/\\/g, '/')}`);

//   return audioFiles;
// });



const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;
const PLAYLISTS_FILE = path.join(app.getPath("userData"), "playlists.json");
app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: "TMusic", // 👈 Set the window title
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

//  mainWindow.loadURL("http://localhost:5173"); // React dev server
  mainWindow.loadURL(`file://${path.join(__dirname, "../dist/index.html")}`);

  mainWindow.on("closed", () => (mainWindow = null));
});

ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog({ properties: ["openDirectory"] });
  if (result.canceled) return [];

  const folderPath = result.filePaths[0];
  const files = fs
    .readdirSync(folderPath)
    .filter(file => file.match(/\.(mp3|wav|ogg)$/i))
    .map(file => ({
      name: path.basename(file),
      path: `file://${path.join(folderPath, file).replace(/\\/g, "/")}`,
    }));

  return files;
});


// Open file dialog
ipcMain.handle("open-file-dialog", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile", "multiSelections"],
    filters: [{ name: "Audio Files", extensions: ["mp3", "wav", "flac"] }],
  });
  return result.filePaths;
});

// Save playlist
ipcMain.on("save-playlist", (event, { playlistId, files }) => {
  let playlists = {};
  if (fs.existsSync(PLAYLISTS_FILE)) {
    playlists = JSON.parse(fs.readFileSync(PLAYLISTS_FILE, "utf-8"));
  }
  playlists[playlistId] = files;
  fs.writeFileSync(PLAYLISTS_FILE, JSON.stringify(playlists, null, 2));
  console.log(PLAYLISTS_FILE);
});

// Load playlist
// ipcMain.handle("load-playlist", async (event, playlistId) => {
//   if (fs.existsSync(PLAYLISTS_FILE)) {
//     const playlists = JSON.parse(fs.readFileSync(PLAYLISTS_FILE, "utf-8"));
//     return playlists[playlistId] || [];
//   }
//   return [];
// });
ipcMain.handle("load-playlist", async (event, playlistId) => {
  try {
    const playlists = JSON.parse(fs.readFileSync(PLAYLISTS_FILE, "utf-8"));
    const playlist = playlists[playlistId] || [];

    // Convert playlist into correct format for the frontend
    const formattedSongs = playlist.map((filePath, index) => ({
      id: `song-${playlistId}-${index}`,
      name: path.basename(filePath), // Extract the filename
      path: filePath, // Keep the full path for playback
    }));

    return formattedSongs;
  } catch (error) {
    console.error("Error loading playlist:", error);
    return [];
  }
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
