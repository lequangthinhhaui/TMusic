import { useState, useEffect } from "react";

const Sidebar = ({ onShowPlaylist }) => {
  const [playlists, setPlaylists] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const createPlaylist = () => {
    if (!playlistName.trim()) return;
    const newPlaylist = { id: `playlist-${Date.now()}`, name: playlistName, musicFiles: [] };
    setPlaylists([...playlists, newPlaylist]);
    setPlaylistName("");
    setModalOpen(false);
  };

  const selectMusicFiles = async (playlistId) => {
    const files = await window.electron.openFileDialog();
    if (files && files.length > 0) {
      window.electron.savePlaylist(playlistId, files);
      setPlaylists((prev) =>
        prev.map((p) => (p.id === playlistId ? { ...p, musicFiles: files } : p))
      );
    }
    setContextMenu(null);
  };

  const loadPlaylistSongs = async (playlistId) => {
    const files = await window.electron.loadPlaylist(playlistId);
    onShowPlaylist(files);
    console.log(files);
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-4 rounded shadow relative">
      {/* Create Playlist Button */}
      <button className="w-full bg-blue-500 text-white p-2 rounded mb-4" onClick={() => setModalOpen(true)}>
        + Create Playlist
      </button>

      {/* Playlists */}
      <ul className="space-y-2">
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <div
              className="cursor-pointer p-2 rounded bg-gray-700 flex justify-between"
              onClick={() => loadPlaylistSongs(playlist.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                setSelectedPlaylist(playlist);
                setContextMenu({ x: e.clientX, y: e.clientY });
              }}
            >
              {playlist.name}
            </div>
          </li>
        ))}
      </ul>

      {/* Right-Click Menu */}
      {contextMenu && (
        <div
          className="absolute bg-gray-700 p-2 rounded shadow-md w-48"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button className="block w-full px-4 py-2 hover:bg-gray-600" onClick={() => selectMusicFiles(selectedPlaylist.id)}>
            Add Music
          </button>
        </div>
      )}

      {/* Modal for Playlist Creation */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-4 rounded shadow-lg w-96">
            <h2 className="text-white text-lg font-bold mb-2">Create Playlist</h2>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Enter playlist name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-red-500 rounded text-white mr-2" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500 rounded text-white" onClick={createPlaylist}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
