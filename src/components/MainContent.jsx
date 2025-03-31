function MainContent({ currentSong }) {
    return (
      <div className="flex flex-col items-center p-6 w-full ">
        {currentSong ? (
          <>
            <h2 className="text-xl font-semibold mt-4">{currentSong.name}</h2>
          </>
        ) : (
          <p className="text-gray-400">Select a song to play</p>
        )}
  
        <textarea
          className="mt-4 w-full max-w-2xl h-96  p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y overflow-auto"
          placeholder="Enter your notes here..."
        ></textarea>
      </div>
    );
  }
  
  export default MainContent;
  