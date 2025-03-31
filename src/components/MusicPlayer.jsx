import { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaRandom, FaRedo } from "react-icons/fa";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";

const MusicPlayer = ({ currentSong, setCurrentSong, songs }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [previousVolume, setPreviousVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const prevTimeRef = useRef(0);

  // Load new song & restore playback position
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.path;
      audioRef.current.load();

      // Restore previous time
      audioRef.current.onloadedmetadata = () => {
        audioRef.current.currentTime = prevTimeRef.current;
        setDuration(audioRef.current.duration || 0);
        if (isPlaying) audioRef.current.play();
      };
    }
  }, [currentSong]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowLeft") {
        rewind(10);
      } else if (e.code === "ArrowRight") {
        forward(10);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTime]);

  const togglePlay = () => {
    if (!currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    if (newVolume === 0) setPreviousVolume(volume);
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(previousVolume);
      audioRef.current.volume = previousVolume;
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      audioRef.current.volume = 0;
    }
  };

  const formatTime = (time) => {
    if (!time) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleNext = () => {
    if (!currentSong || !songs.length) return;
    prevTimeRef.current = 0;
    let nextSong;
    if (shuffle) {
      let randomIndex = Math.floor(Math.random() * songs.length);
      nextSong = songs[randomIndex];
    } else {
      nextSong = songs[(currentSong.id + 1) % songs.length];
    }
    setCurrentSong(nextSong);
  };

  const handlePrev = () => {
    if (!currentSong || !songs.length) return;
    prevTimeRef.current = 0;
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    if (currentIndex === -1) return;
    const prevSong = songs[(currentIndex - 1 + songs.length) % songs.length];
    setCurrentSong(prevSong);
  };

  const handleSongEnd = () => {
    if (repeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      handleNext();
    }
  };

  const rewind = (seconds) => {
    const newTime = Math.max(0, currentTime - seconds);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const forward = (seconds) => {
    const newTime = Math.min(duration, currentTime + seconds);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="bg-gray-700 text-white flex items-center justify-between p-4 rounded-lg shadow-md">
      {/* Left: Song Info */}
      <div className="flex items-center gap-3">
        {currentSong && (
          <>
            <div>
              <h3 className="text-sm font-semibold">{currentSong.title}</h3>
              <p className="text-xs text-gray-400">{currentSong.artist}</p>
            </div>
          </>
        )}
      </div>

      {/* Middle: Controls */}
      <div className="flex items-center gap-5">
        <FaRandom 
          className={`cursor-pointer ${shuffle ? "text-purple-500" : "text-gray-400"} transition duration-200`} 
          onClick={() => setShuffle(!shuffle)}
        />
        <FaStepBackward className="cursor-pointer text-lg hover:text-purple-400 transition" onClick={handlePrev} />
        {isPlaying ? (
          <FaPause className="cursor-pointer text-xl hover:text-purple-400 transition" onClick={togglePlay} />
        ) : (
          <FaPlay className="cursor-pointer text-xl hover:text-purple-400 transition" onClick={togglePlay} />
        )}
        <FaStepForward className="cursor-pointer text-lg hover:text-purple-400 transition" onClick={handleNext} />
        <FaRedo 
          className={`cursor-pointer ${repeat ? "text-purple-500" : "text-gray-400"} transition duration-200`} 
          onClick={() => setRepeat(!repeat)}
        />
      </div>

      {/* Right: Seek Bar & Volume */}
      <div className="flex items-center gap-3 w-1/3">
        <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full cursor-pointer accent-purple-500"
        />
        <span className="text-xs text-gray-400">{formatTime(duration)}</span>

        {/* Volume Control */}
        {volume === 0 ? (
          <HiSpeakerXMark className="cursor-pointer text-lg hover:text-purple-400 transition" onClick={toggleMute} />
        ) : (
          <HiSpeakerWave className="cursor-pointer text-lg hover:text-purple-400 transition" onClick={toggleMute} />
        )}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="cursor-pointer w-16 accent-purple-500"
        />
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleSongEnd}
      />
    </div>
  );
};

export default MusicPlayer;
