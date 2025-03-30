import { motion } from "framer-motion"
import { Heart, SkipBack, Play, Pause, SkipForward, Volume2, VolumeX } from "lucide-react"
import { useEffect } from "react"

interface PlayerBarProps {
  currentCover: {
    title: string
    artist: string
    cover: string
    favourite: boolean
  }
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  setShowCoverPage: (show: boolean) => void
  audioRef: React.RefObject<HTMLAudioElement>
  onNext: () => void
  onPrevious: () => void
  volume: number
  setVolume: (volume: number) => void
  isMuted: boolean
  toggleMute: () => void
}

export function PlayerBar({
  currentCover,
  isPlaying,
  setIsPlaying,
  setShowCoverPage,
  onNext,
  onPrevious,
  volume,
  setVolume,
  isMuted,
  toggleMute,
  audioRef
}: PlayerBarProps) {
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume; // Set volume
      audioRef.current.muted = isMuted; // Mute/unmute audio
    }
  }, [volume, isMuted, audioRef]); // Run when volume or mute state changes
  
  useEffect(() => {
    console.log("currentCover", currentCover.favourite)
  })
  
  return (
    <div className="sticky bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24 bg-black/50 backdrop-blur-xl border-t border-white/10 px-2 sm:px-4 md:px-6 z-20" style={{background : "darkslategrey"}}>
      <div className="flex items-center justify-between h-full max-w-screen-2xl mx-auto">
        
        {/* Left Side */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-1/3 min-w-0">
          <motion.button 
            className="flex items-center gap-2 sm:gap-3 md:gap-4 group overflow-hidden" 
            onClick={() => setShowCoverPage(true)}
          >
            <motion.div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
              <img 
                src={currentCover.cover || "/placeholder.svg"} 
                alt={currentCover.title} 
                className="h-full object-cover" 
                style={{width : "458px"}}
              />
            </motion.div>
            <div className="min-w-0 hidden sm:block">
              <p className="font-medium text-base sm:text-lg text-white truncate">{currentCover.title}</p>
              <p className="text-xs sm:text-sm text-white/70 truncate">{currentCover.artist}</p>
            </div>
          </motion.button>
          <motion.button className="p-1 sm:p-2 text-white/70 hover:text-white">
            <Heart size={18} className={currentCover.favourite ? "text-red-500" : "text-white"} />
          </motion.button>
        </div>

        {/* Center Controls */}
        <div className="flex flex-col items-center gap-1 sm:gap-2 w-1/3">
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            <motion.button 
              className="p-1 sm:p-2 text-white/70 hover:text-white" 
              onClick={onPrevious}
            >
              <SkipBack size={16} className="sm:hidden" />
              <SkipBack size={20} className="hidden sm:block" />
            </motion.button>
            <motion.button 
              className="p-2 sm:p-3 md:p-4 rounded-full bg-white text-black hover:bg-gray-200 shadow-lg" 
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <>
                  <Pause size={18} className="sm:hidden" />
                  <Pause size={24} className="hidden sm:block" />
                </>
              ) : (
                <>
                  <Play size={18} className="ml-0.5 sm:hidden" />
                  <Play size={24} className="ml-0.5 hidden sm:block" />
                </>
              )}
            </motion.button>
            <motion.button 
              className="p-1 sm:p-2 text-white/70 hover:text-white" 
              onClick={onNext}
            >
              <SkipForward size={16} className="sm:hidden" />
              <SkipForward size={20} className="hidden sm:block" />
            </motion.button>
          </div>
        </div>

        {/* Right Side - Volume Control */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 md:gap-4 w-1/3">
          <button
            className="p-1 sm:p-2 text-white/70 hover:text-white"
            onClick={toggleMute}
          >
            {isMuted ? (
              <>
                <VolumeX size={16} className="sm:hidden" />
                <VolumeX size={20} className="hidden sm:block" />
              </>
            ) : (
              <>
                <Volume2 size={16} className="sm:hidden" />
                <Volume2 size={20} className="hidden sm:block" />
              </>
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              const newVolume = parseFloat(e.target.value);
              setVolume(newVolume);
            }}
            className="w-12 sm:w-16 md:w-24 cursor-pointer"
            disabled={isMuted} // Disables slider when muted
          />
        </div>
      </div>
    </div>
  );
}