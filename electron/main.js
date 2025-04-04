const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
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

ipcMain.handle("remove-file-from-playlist", async (event, playlistId, filePath) => {
  try {
    const result = await PlaylistFile.destroy({
      where: { playlistId, filePath },
    });

    if (result === 0) {
      throw new Error("File not found in playlist");
    }

    console.log(`Removed file ${filePath} from playlist ${playlistId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to remove file from playlist:", error);
    return { success: false, error: error.message };
  }
});

// Handle loading all playlists and their associated files
ipcMain.handle("load-playlists", async () => {
  try {
    // Fetch all playlists and their associated files from the database
    const playlists = await Playlist.findAll({
      include: {
        model: PlaylistFile,
        attributes: ['filePath'], // Get the file paths of the music files
      },
    });

    // Format the playlists into a more usable structure for the frontend
    const formattedPlaylists = playlists.map(playlist => {
      return {
        id: playlist.id,
        name: playlist.name,
        files: playlist.PlaylistFiles.map(file => file.filePath),
      };
    });

    return formattedPlaylists;
  } catch (error) {
    console.error("Error loading playlists:", error);
    return [];
  }
});


// Set up SQLite database using Sequelize
const userDataPath = app.getPath("userData"); // Safe, writable location
const dbPath = path.join(userDataPath, "playlists.db");
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath, // Database file path
});

// Define Playlist model
const Playlist = sequelize.define('Playlist', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define PlaylistFile model (for storing music files related to playlists)
const PlaylistFile = sequelize.define('PlaylistFile', {
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define associations
Playlist.hasMany(PlaylistFile, { foreignKey: "playlistId" });
PlaylistFile.belongsTo(Playlist, { foreignKey: "playlistId" });

// Initialize database
async function initializeDB() {
  try {
    await sequelize.sync(); // Sync the models with the database
    console.log("Database synced");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
}

// Handle creating a playlist
ipcMain.handle("create-playlist", async (event, name) => {
  try {
    const playlist = await Playlist.create({ name });
    console.log("Playlist created:", playlist.id);
    return playlist.id; // Return the new playlist ID

  } catch (error) {
    console.error("Failed to create playlist:", error);
    throw error;
  }
});

// Handle saving music files for a playlist
ipcMain.handle("save-playlist", async (event, playlistId, files) => {
  try {
    const playlist = await Playlist.findByPk(playlistId);
    if (!playlist) {
      throw new Error("Playlist not found");
    }

    console.log("Saving files for playlist:", playlistId, files);
    await PlaylistFile.bulkCreate(
      files.map((file) => ({
        playlistId: playlistId,
        filePath: file,
      }))
    );
  } catch (error) {
    console.error("Failed to save music files:", error);
    throw error;
  }
});

// Handle loading music files for a playlist
ipcMain.handle("load-playlist", async (event, playlistId) => {
  try {
    const playlistFiles = await PlaylistFile.findAll({
      where: { playlistId },
      attributes: ['filePath'],
    });
    return playlistFiles.map((file) => file.filePath);
  } catch (error) {
    console.error("Failed to load playlist files:", error);
    throw error;
  }
});

// Handle removing a playlist
ipcMain.handle("removePlaylist", async (event, playlistId) => {
  try {
    // First, remove all associated files from PlaylistFile
    await PlaylistFile.destroy({
      where: { playlistId },
    });

    // Then, remove the playlist itself
    const result = await Playlist.destroy({
      where: { id: playlistId },
    });

    if (result === 0) {
      throw new Error("Playlist not found");
    }

    console.log(`Removed playlist ${playlistId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to remove playlist:", error);
    return { success: false, error: error.message };
  }
});

app.whenReady().then(() => {
  initializeDB();
  // Create your window here (BrowserWindow logic)
});


app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
