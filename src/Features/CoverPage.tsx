import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  SkipBack, 
  SkipForward, 
  Play, 
  Pause, 
  Heart, 
  Volume2,
  VolumeX
} from "lucide-react"
import { MoodDropdown } from "../components/MoodDropdown"
import { AudioVisualizer } from "../components/AudioVisualizer"

// Update your CoverPage component to include the necessary props
interface CoverPageProps {
  currentCover: {
    id: number
    title: string
    artist: string
    cover: string
    mood: string
    favourite: boolean
  }
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  onClose: () => void
  onChangeCover: (cover: any) => void
  selectedMood: {
    name: string
    gradient: string
    visualizerColors: string[]
  }
  setSelectedMood: (mood: any) => void
  // Add these new props to match PlayerBar
  audioRef: React.RefObject<HTMLAudioElement>
  onNext: () => void
  onPrevious: () => void
  volume: number
  setVolume: (volume: number) => void
  isMuted: boolean
  toggleMute: () => void
}

export function CoverPage({
  currentCover,
  isPlaying,
  setIsPlaying,
  onClose,
  selectedMood,
  setSelectedMood,
  // Add these new props
  audioRef,
  onNext,
  onPrevious,
  volume,
  setVolume,
  isMuted,
  toggleMute,
}: CoverPageProps) {

  // Current time and duration states
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [direction, setDirection] = useState(0)
  
  // Add a function to format time in mm:ss format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  // Animation variants for 3D cover transitions
  const coverVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      rotateY: direction > 0 ? -15 : 15,
      scale: 0.9,
      zIndex: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1,
      zIndex: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        rotateY: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      rotateY: direction < 0 ? -15 : 15,
      scale: 0.9,
      zIndex: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        rotateY: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    }),
  }

  // Update time when audio plays
  useEffect(() => {
    const updateTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime)
        setDuration(audioRef.current.duration || 0)
      }
    }
    
    const audioElement = audioRef.current
    if (audioElement) {
      audioElement.addEventListener('timeupdate', updateTime)
      audioElement.addEventListener('loadedmetadata', updateTime)
    }
    
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', updateTime)
        audioElement.removeEventListener('loadedmetadata', updateTime)
      }
    }
  }, [audioRef])

  // Function to handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  // Render playback controls - separated for reuse in different layouts
  const renderPlaybackControls = (size: "small" | "large") => {
    const isSmall = size === "small";
    
    return (
      <div className={`flex items-center ${isSmall ? "justify-center gap-4 sm:gap-6 md:gap-8" : "gap-8"}`}>
        {/* Previous button */}
        <motion.button
          className={`${isSmall ? "p-2 sm:p-3" : "p-3"} rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20`}
          onClick={onPrevious}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isSmall ? (
            <>
              <SkipBack size={20} className="sm:hidden" />
              <SkipBack size={24} className="hidden sm:block" />
            </>
          ) : (
            <SkipBack size={22} />
          )}
        </motion.button>
        
        {/* Play/Pause button */}
        <motion.button
          className={`${isSmall ? "p-4 sm:p-5" : "p-5"} rounded-full bg-white text-black hover:bg-gray-200 shadow-lg`}
          onClick={() => setIsPlaying(!isPlaying)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isPlaying ? (
            isSmall ? (
              <>
                <Pause size={24} className="sm:hidden" />
                <Pause size={28} className="hidden sm:block" />
              </>
            ) : (
              <Pause size={28} />
            )
          ) : (
            isSmall ? (
              <>
                <Play size={24} className="ml-1 sm:hidden" />
                <Play size={28} className="hidden sm:block ml-1" />
              </>
            ) : (
              <Play size={28} className="ml-1" />
            )
          )}
        </motion.button>
        
        {/* Next button */}
        <motion.button
          className={`${isSmall ? "p-2 sm:p-3" : "p-3"} rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20`}
          onClick={onNext}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isSmall ? (
            <>
              <SkipForward size={20} className="sm:hidden" />
              <SkipForward size={24} className="hidden sm:block" />
            </>
          ) : (
            <SkipForward size={22} />
          )}
        </motion.button>
        
        {/* Favorite button */}
        <motion.button
          className={`${isSmall ? "p-2 sm:p-3" : "p-3"} rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isSmall ? (
            <>
              <Heart 
                size={20} 
                className={`sm:hidden ${currentCover.favourite ? "text-red-500" : "text-white"}`} 
              />
              <Heart 
                size={24} 
                className={`hidden sm:block ${currentCover.favourite ? "text-red-500" : "text-white"}`} 
              />
            </>
          ) : (
            <Heart size={22} className={currentCover.favourite ? "text-red-500" : "text-white"} />
          )}
        </motion.button>
      </div>
    );
  };

  // Render volume control - separated for reuse
  const renderVolumeControl = (size: "small" | "large") => {
    const isSmall = size === "small";
    
    return (
      <div className={`flex items-center ${isSmall ? "justify-center gap-2 mt-4" : "gap-4 ml-auto"}`}>
        <button className="p-2 text-white/70 hover:text-white" onClick={toggleMute}>
          {isMuted ? 
            <VolumeX size={isSmall ? 18 : 20} /> : 
            <Volume2 size={isSmall ? 18 : 20} />
          }
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className={`${isSmall ? "w-24 sm:w-32" : "w-24"} h-1 appearance-none bg-white/20 rounded-full overflow-hidden cursor-pointer`}
          disabled={isMuted}
          style={{
            background: `linear-gradient(to right, white ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.2) ${(isMuted ? 0 : volume) * 100}%)`
          }}
        />
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      {/* Dynamic background gradient based on mood */}
      <div className={`fixed inset-0 transition-colors duration-1000 ${selectedMood.gradient}`} />

      {/* Blurred album art background */}
      <motion.div
        className="fixed inset-0 -z-10 opacity-30"
        initial={false}
        animate={{ scale: 1.1 }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      >
        <img src={currentCover.cover || "/placeholder.svg"} alt="" className="w-full h-full object-cover blur-2xl" />
      </motion.div>

      <div className="fixed inset-0 bg-black/40" />

      <div className="relative min-h-full flex flex-col">
        {/* Header with close button and mood selector */}
        <div className="flex justify-between items-center p-4 sm:p-6 md:p-8">
          <MoodDropdown selectedMood={selectedMood} setSelectedMood={setSelectedMood} />

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
          >
            <X size={20} className="sm:hidden" />
            <X size={24} className="hidden sm:block" />
          </button>
        </div>

        {/* Main content area with responsive layouts */}
        <div className="flex-1 flex flex-col justify-between px-4 sm:px-6 pb-8">
          {/* Small/Medium screen layout */}
          <div className="lg:hidden w-full flex flex-col items-center">
            {/* Album cover */}
            <div className="w-full max-w-md flex items-center justify-center p-2 sm:p-4 md:p-6 relative">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentCover.id}
                  custom={direction}
                  variants={coverVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    perspective: 1000,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <img
                    src={currentCover.cover || "/placeholder.svg"}
                    alt={currentCover.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Track info */}
            <motion.div
              className="w-full mb-4 sm:mb-6 mt-4"
              initial={false}
              animate={{ y: isPlaying ? -5 : 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-1 sm:mb-2 text-center truncate">
                {currentCover.title}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/80 text-center truncate">
                {currentCover.artist}
              </p>
            </motion.div>

            {/* Audio visualizer - only show when playing */}
            {isPlaying && (
              <div className="h-16 sm:h-24 md:h-32 mb-4 w-full">
                <AudioVisualizer isPlaying={isPlaying} colors={selectedMood.visualizerColors} />
              </div>
            )}

            {/* Progress bar */}
            <div className="mb-4 sm:mb-6 w-full max-w-md">
              <div className="flex items-center gap-2 sm:gap-4 mb-1 sm:mb-2">
                <span className="text-xs sm:text-sm text-white/60">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.01"
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1 appearance-none bg-white/20 rounded-full overflow-hidden cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, white ${(currentTime / (duration || 100)) * 100}%, rgba(255, 255, 255, 0.2) ${(currentTime / (duration || 100)) * 100}%)`
                  }}
                />
                <span className="text-xs sm:text-sm text-white/60">{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Push controls to bottom for small/medium screens */}
          <div className="flex-grow lg:hidden"></div>

          {/* Playback controls for small/medium screens */}
          <div className="w-full max-w-md mx-auto mb-4 lg:hidden">
            {renderPlaybackControls("small")}
            {renderVolumeControl("small")}
          </div>

          {/* Large screen layout */}
          <div className="hidden lg:flex lg:flex-row lg:items-center lg:justify-between lg:w-full lg:max-w-6xl lg:mx-auto">
            {/* Album cover */}
            <div className="w-3/5 flex items-center justify-center p-8 relative">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentCover.id}
                  custom={direction}
                  variants={coverVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    perspective: 1000,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <img
                    src={currentCover.cover || "/placeholder.svg"}
                    alt={currentCover.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Track info and controls */}
            <div className="w-2/5 flex flex-col justify-center px-12">
              <motion.div
                className="mb-6"
                initial={false}
                animate={{ y: isPlaying ? -5 : 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-5xl text-white font-bold mb-3 text-left truncate">{currentCover.title}</h1>
                <p className="text-2xl text-white/80 text-left truncate">{currentCover.artist}</p>
              </motion.div>

              {/* Audio visualizer - only show when playing */}
              {isPlaying && (
                <div className="h-40 mb-6">
                  <AudioVisualizer isPlaying={isPlaying} colors={selectedMood.visualizerColors} />
                </div>
              )}

              {/* Progress bar */}
              <div className="mb-6 w-full">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm text-white/60">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.01"
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 appearance-none bg-white/20 rounded-full overflow-hidden cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, white ${(currentTime / (duration || 100)) * 100}%, rgba(255, 255, 255, 0.2) ${(currentTime / (duration || 100)) * 100}%)`
                    }}
                  />
                  <span className="text-sm text-white/60">{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls for large screens - directly below track info */}
              <div className="flex items-center justify-between">
                {renderPlaybackControls("large")}
                {renderVolumeControl("large")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}