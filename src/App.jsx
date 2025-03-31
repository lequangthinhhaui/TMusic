import { useState } from "react";
import SideBar from "./components/SideBar";
import MusicPlayer from "./components/MusicPlayer";
import Playlist from "./components/Playlist";
import TopBar from "./components/TopBar";
import MainContent from "./components/MainContent";

function App() {
  const [songs, setSongs] = useState([]); // Contains all songs
  const [currentSong, setCurrentSong] = useState(null);

  // Function to open a folder and load MP3 files
  const selectFolder = async () => {
    const files = await window.electronAPI.selectFolder();

    if (Array.isArray(files) && files.length > 0) {
      // Assign a unique id to each song (using index)
      const songsWithId = files.map((file, index) => ({
        ...file,
        id: index, // Assign an ID based on its position
      }));

      setSongs(songsWithId);
      setCurrentSong(songsWithId[0]); // Set first song as default
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      <header class="flex">
        <TopBar />
      </header>

      <div class="flex flex-1 ">
        <aside class="w-64 text-white ml-2 mr-1 bg-gray-900 border border-gray-900 rounded-lg">
          <SideBar onSelectFolder={selectFolder} />
          {/* <SideBar onAddToPlaylist ={setSongs} /> */}
        </aside>

        <main class="flex-1 flex flex-row bg-gray-900 text-white ml-1 mr-2 overflow-auto rounded-lg ">
          <div className="basis-3/4 ">
            <MainContent currentSong={currentSong} />
          </div>
          <div className="basis-1/4 border-l border-gray-700">
            <Playlist songs={songs} onSelect={setCurrentSong} currentSong={currentSong} />
          </div>
        </main>

      </div>

      {/* <footer class="flex justify-center bg-gray-900 text-white p-4 m-2 rounded-lg shadow-md"> */}
      <footer class="bg-gray-900 text-white p-4 m-2 rounded-lg shadow-md">

        <MusicPlayer currentSong={currentSong} setCurrentSong={setCurrentSong} songs={songs} />
      </footer>
    </div>
  );
}

export default App;
