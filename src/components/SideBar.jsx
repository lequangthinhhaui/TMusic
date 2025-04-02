import { useState, useEffect } from "react";
import { Box, Button, TextField, List, ListItem, ListItemText, Menu, MenuItem, Modal, Typography, createTheme, ThemeProvider } from "@mui/material";

// Dark Mode Theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Set to 'dark' for dark mode
    background: {
      default: '#121212', // Dark background for the app
      paper: '#1d1d1d', // Dark background for surface elements like cards
    },
    text: {
      primary: '#fff', // White text color for better contrast on dark background
    },
    primary: {
      main: '#bb86fc', // Accent color (e.g., purple for buttons and highlights)
    },
    secondary: {
      main: '#03dac6', // Another accent color (e.g., teal for buttons)
    },
  },
});

const Sidebar = ({ onShowPlaylist }) => {
  const [playlists, setPlaylists] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");

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

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ width: 250, bgcolor: "background.paper", p: 2, borderRadius: 2, boxShadow: 3 }}>
        {/* Create Playlist Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => setModalOpen(true)}
        >
          + Create Playlist
        </Button>

        {/* Playlists List */}
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

        {/* Context Menu for Right Click */}
        <Menu
          open={Boolean(contextMenu)}
          onClose={() => setContextMenu(null)}
          anchorReference="anchorPosition"
          anchorPosition={contextMenu ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
        >
          <MenuItem onClick={() => selectMusicFiles(selectedPlaylist.id)}>Add Music</MenuItem>
        </Menu>

        {/* Modal for Playlist Creation */}
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
              error={!playlistName.trim()}
              helperText={!playlistName.trim() ? "Playlist name cannot be empty." : ""}
            />
            <Box mt={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={() => setModalOpen(false)} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={createPlaylist}
                disabled={!playlistName.trim()}
              >
                Create
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default Sidebar;
