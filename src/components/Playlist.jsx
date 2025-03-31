function Playlist({ songs, onSelect, currentSong }) {
  return (
    <div className="flex-1 p-4 border border-gray-900 overflow-auto max-h-96">
      <h2 className="text-lg font-bold">Playlist</h2>
      <ul className="mt-4 space-y-1">
        {songs.map((song, index) => (
          <li
            key={song.id}
            className={`p-2 rounded cursor-pointer flex items-center gap-2 transition-colors duration-200 ${
              currentSong && currentSong.id === song.id
                ? "bg-purple-400 text-white font-bold"
                : "hover:bg-gray-700"
            }`}
            onClick={() => onSelect(song)}
          >
            <span className="text-white">{index + 1}.</span>
            <span>{song.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Playlist;
// const Playlist = ({ songs, onSelect, currentSong }) => {
//   return (
//     <div className="flex-1 p-4 border border-gray-900 overflow-auto max-h-96">
//       <h2 className="text-lg font-bold">Playlist</h2>
//       <ul className="mt-4 space-y-1">
//         {songs.length === 0 ? (
//           <p className="text-gray-400">No audio files available</p>
//         ) : (
//           songs.map((song, index) => (
//             <li
//               key={song.id}
//               className={`p-2 rounded cursor-pointer flex items-center gap-2 transition-colors duration-200 ${
//                 currentSong && currentSong.id === song.id
//                   ? "bg-purple-400 text-white font-bold"
//                   : "hover:bg-gray-700"
//               }`}
//               onClick={() => onSelect(song)}
//             >
//               <span className="text-white">{index + 1}.</span>
//               <span>{song.name}</span>
//             </li>
//           ))
//         )}
//       </ul>
//     </div>
//   );
// };

// export default Playlist;
