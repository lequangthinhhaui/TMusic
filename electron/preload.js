const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Select folder to add music files
  selectFolder: () => ipcRenderer.invoke('select-folder'),

  // Open file dialog to select individual music files
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),

  // Load all playlists
  loadPlaylists: () => ipcRenderer.invoke('load-playlists'),

  // Create a new playlist
  createPlaylist: (name) => ipcRenderer.invoke('create-playlist', name),

  // Save playlist to SQLite database
  savePlaylist: (playlistId, files) => ipcRenderer.invoke('save-playlist', playlistId, files),

  // Load playlist from SQLite database
  loadPlaylist: (playlistId) => ipcRenderer.invoke('load-playlist', playlistId),

  // Remove a file from a playlist
  removeFileFromPlaylist: (playlistId, filePath) => ipcRenderer.invoke("remove-file-from-playlist", playlistId, filePath),

  // Remove a playlist
  removePlaylist: (playlistId) => ipcRenderer.invoke("removePlaylist", playlistId),
});