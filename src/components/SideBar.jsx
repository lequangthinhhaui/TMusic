import { useState, useEffect } from "react";
import { Box, Button, TextField, List, ListItem, ListItemText, Menu, MenuItem, Modal, Typography, createTheme, ThemeProvider, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

// Dark Mode Theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#121212", paper: "#1d1d1d" },
    text: { primary: "#fff" },
    primary: { main: "#bb86fc" },
    secondary: { main: "#03dac6" },
  },
});

const Sidebar = ({ onShowPlaylist }) => {
  const [playlists, setPlaylists] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isRemoveModalOpen, setRemoveModalOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [selectedPlaylistFiles, setSelectedPlaylistFiles] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await window.electron.loadPlaylists();
        setPlaylists(response);
      } catch (error) {
        console.error("Error loading playlists:", error);
      }
    };
    fetchPlaylists();
  }, []);

  const createPlaylist = async () => {
    if (!playlistName.trim()) return;
    try {
      const newPlaylistId = await window.electron.createPlaylist(playlistName.trim());
      const newPlaylist = { id: newPlaylistId, name: playlistName.trim(), musicFiles: [] };
      setPlaylists((prev) => [...prev, newPlaylist]);
      setPlaylistName("");
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to create playlist:", error);
    }
  };

  const selectMusicFiles = async (playlistId) => {
    const files = await window.electron.openFileDialog();
    if (files && files.length > 0) {
      try {
        await window.electron.savePlaylist(playlistId, files);
        setPlaylists((prev) =>
          prev.map((p) => (p.id === playlistId ? { ...p, musicFiles: files } : p))
        );
      } catch (error) {
        console.error("Failed to save music files:", error);
      }
    }
    setContextMenu(null);
  };

  const loadPlaylistSongs = async (playlistId) => {
    try {
      const files = await window.electron.loadPlaylist(playlistId);
      const songsWithId = files.map((file, index) => {
        const fileName = file.split("\\").pop();
        return { id: index, path: file, name: fileName };
      });

      onShowPlaylist(songsWithId);
    } catch (error) {
      console.error("Failed to load playlist songs:", error);
    }
  };

  const openRemoveFileModal = async (playlist) => {
    if (!playlist) return;
  
    try {
      const files = await window.electron.loadPlaylist(playlist.id); // Load files from DB
      setSelectedPlaylist(playlist);
      setSelectedPlaylistFiles(files); // Store fetched files
      setRemoveModalOpen(true);
    } catch (error) {
      console.error("Failed to load files:", error);
    }
  };

  const removeFileFromPlaylist = async (filePath) => {
    if (!selectedPlaylist || !filePath) return;
  
    try {
      const result = await window.electron.removeFileFromPlaylist(selectedPlaylist.id, filePath);
  
      if (result.success) {
        // Fetch updated list from DB
        const updatedFiles = await window.electron.loadPlaylist(selectedPlaylist.id);
        setSelectedPlaylistFiles(updatedFiles || []); // ✅ Ensure it's always an array
      } else {
        console.error("Failed to remove file:", result.error);
      }
    } catch (error) {
      console.error("Error removing file:", error);
    }
  };


  const removePlaylist = async () => {
    if (!selectedPlaylist) return;

    try {
      await window.electron.removePlaylist(selectedPlaylist.id);
      setPlaylists((prev) => prev.filter((p) => p.id !== selectedPlaylist.id));
    } catch (error) {
      console.error("Failed to remove playlist:", error);
    }
    setContextMenu(null);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ width: 250, bgcolor: "background.paper", p: 2, borderRadius: 2, boxShadow: 3 }}>
        <Button variant="contained" color="primary" fullWidth onClick={() => setModalOpen(true)}>
          + Create Playlist
        </Button>

        <List>
          {playlists.map((playlist) => (
            <ListItem
              button
              key={playlist.id}
              onClick={() => loadPlaylistSongs(playlist.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                setSelectedPlaylist(playlist);
                setContextMenu({ mouseX: e.clientX - 2, mouseY: e.clientY - 4 });
              }}
            >
              <ListItemText primary={playlist.name} />
            </ListItem>
          ))}
        </List>

        {/* Context Menu*/}
        <Menu
          open={Boolean(contextMenu)}
          onClose={() => setContextMenu(null)}
          anchorReference="anchorPosition"
          anchorPosition={contextMenu ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
        >
          {selectedPlaylist && (
            <>
              <MenuItem onClick={() => selectMusicFiles(selectedPlaylist.id)}>Add Music</MenuItem>
              <MenuItem onClick={() => openRemoveFileModal(selectedPlaylist)}>Remove File</MenuItem>
              <MenuItem onClick={removePlaylist}>Remove Playlist</MenuItem>
            </>
          )}
        </Menu>

        {/* Modal for Creating Playlist */}
        <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 3,
              borderRadius: 2,
              minWidth: 300,
            }}
          >
            <Typography variant="h6">Create Playlist</Typography>
            <TextField
              fullWidth
              label="Playlist Name"
              variant="outlined"
              margin="dense"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
            <Box mt={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={() => setModalOpen(false)} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={createPlaylist}>
                Create
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Modal for Removing Files */}
        <Modal open={isRemoveModalOpen} onClose={() => setRemoveModalOpen(false)}>
          <Box sx={{ ...modalStyle, minWidth: 400 }}>
            <Typography variant="h6">Remove a File</Typography>
            <List>
              {selectedPlaylistFiles.map((file, index) => (
                <ListItem key={index}>
                  <ListItemText primary={file.split("\\").pop()} />
                  <IconButton onClick={() => removeFileFromPlaylist(file)} color="error">
                    <Delete />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
};

export default Sidebar;
