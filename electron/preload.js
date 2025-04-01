const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  openFileDialog: () => ipcRenderer.invoke("open-file-dialog"),
  savePlaylist: (playlistId, files) => ipcRenderer.send("save-playlist", { playlistId, files }),
  loadPlaylist: (playlistId) => ipcRenderer.invoke("load-playlist", playlistId),
});
