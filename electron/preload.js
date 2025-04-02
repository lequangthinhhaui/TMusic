// const { contextBridge, ipcRenderer } = require("electron");

// contextBridge.exposeInMainWorld("electron", {
//   openFileDialog: () => ipcRenderer.invoke("open-file-dialog"),
//   savePlaylist: (playlistId, files) => ipcRenderer.send("save-playlist", { playlistId, files }),
//   loadPlaylist: (playlistId) => ipcRenderer.invoke("load-playlist", playlistId),
// });
// preload.js

// preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Select folder to add music files
  selectFolder: () => ipcRenderer.invoke('select-folder'),

  // Open file dialog to select individual music files
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),


  loadPlaylists: () => ipcRenderer.invoke('load-playlists'), // Exposing load-playlists



  // Create a new playlist
  createPlaylist: (name) => ipcRenderer.invoke('create-playlist', name),

  // Save playlist to SQLite database
  savePlaylist: (playlistId, files) => ipcRenderer.invoke('save-playlist', playlistId, files),

  // Load playlist from SQLite database
  loadPlaylist: (playlistId) => ipcRenderer.invoke('load-playlist', playlistId),
});
