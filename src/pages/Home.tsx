"use client"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Settings,
  User,
  Music,
  Disc,
  BarChart2,
} from "lucide-react"
import { WeeklyTracks } from "../components/WeeklyTracks"
import { coverOptions } from "../data/coverOptions"

interface HomePageProps {
  currentCover: {
    id: number
    title: string
    artist: string
    cover: string
    audio: string
    mood?: string
    duration?: string
  }
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  setCurrentIndex: (index: number | ((prevIndex: number) => number)) => void
  setShowPlayerBar: (show: boolean) => void
  setShowCoverPage: (show: boolean) => void
}

export function HomePage({ currentCover, isPlaying, setIsPlaying, setCurrentIndex, setShowPlayerBar, setShowCoverPage }: HomePageProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [activeTab, setActiveTab] = useState("discover")
  const [searchQuery, setSearchQuery] = useState("")
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState("0:00")
  const [duration, setDuration] = useState("0:00")


  const filteredCovers = coverOptions.filter((cover) =>
    cover.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cover.artist.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const trendingCovers = coverOptions.filter((cover) => cover.trending === true)
  const favouriteCovers = coverOptions.filter((cover) => cover.favourite === true)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.currentTime = 0; // Reset progress
      setProgress(0);
      setCurrentTime("0:00");
      setDuration("0:00");
  
      if (isPlaying) {
        setTimeout(() => {
          audioRef.current
            ?.play()
            .catch((error) => console.error("Error playing audio:", error));
        }, 100); // Ensures playback starts properly
      }
    }
  }, [currentCover]); // Runs whenever song changes
  

  useEffect(() => {
    const audio = audioRef.current;
  
    if (!audio) return;
  
    const updateProgress = () => {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
  
      if (duration) {
        setProgress((currentTime / duration) * 100);
        setCurrentTime(formatTime(currentTime));
        setDuration(formatTime(duration));
      }
    };
  
    audio.addEventListener("timeupdate", updateProgress);
  
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [currentCover]); // Re-run effect when song changes

  const handleNextTrack = () => {
    setCurrentIndex((prev) => (prev < coverOptions.length - 1 ? prev + 1 : 0))
    setIsPlaying(true)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" + secs : secs}`
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime
      const duration = audioRef.current.duration
  
      if (!isNaN(duration) && duration > 0) {
        setProgress((current / duration) * 100)
        setCurrentTime(formatTime(current))
        setDuration(formatTime(duration))
      }
    }
  }

  // Ensure duration is set when metadata loads
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const duration = audioRef.current.duration
      if (!isNaN(duration) && duration > 0) {
        setDuration(formatTime(duration))
      }
    }
  }

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-b from-gray-900 to-black">
      <div className="p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
          <div className="w-full sm:w-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search for artists, songs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full bg-gray-800/50 hover:bg-gray-800/80 focus:bg-gray-800/80 focus:outline-none w-full sm:w-[250px] md:w-[300px] text-sm transition-all text-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-800/80 transition-colors">
              <Settings size={18} className="text-gray-300" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-800/70 flex items-center justify-center">
              <User size={18} className="text-gray-300" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Left Column - Now Playing */}
            <div className="w-full lg:w-1/3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCover.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-xl"
                >
                  <h2 className="text-xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                    <Disc className="mr-2" size={20} />
                    Now Playing
                  </h2>

                  <div className="relative group mb-4 sm:mb-6">
                    <motion.button 
                      className="flex items-center gap-4 group w-full justify-center" 
                      onClick={() => setShowCoverPage(true)}
                    >
                      <motion.div 
                        className="rounded-xl overflow-hidden shadow-2xl w-full max-w-[280px]" 
                        whileHover={{ scale: 1.02 }}
                      >
                        <img
                          src={currentCover.cover || "/placeholder.svg?height=280&width=280"}
                          alt={currentCover.title}
                          className="w-full aspect-square object-cover"
                        />
                      </motion.div>
                    </motion.button>
                  </div>

                  <div className="text-center mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">{currentCover.title}</h1>
                    <p className="text-gray-400">{currentCover.artist}</p>
                  </div>

                  <audio
                    ref={audioRef}
                    src={currentCover.audio}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleNextTrack}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column - Content */}
            <div className="w-full lg:w-2/3">
              {/* Tabs */}
              <div className="mb-6 border-b border-gray-800 overflow-x-auto">
                <div className="flex space-x-4 sm:space-x-6 min-w-max pb-1">
                  {[
                    { id: "discover", label: "Discover", icon: <Music size={18} /> },
                    { id: "trending", label: "Trending", icon: <BarChart2 size={18} /> },
                    { id: "favourite", label: "Favourite", icon: <BarChart2 size={18} /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`flex items-center gap-2 pb-3 px-1 ${activeTab === tab.id ? "text-white border-b-2 border-purple-500" : "text-gray-400 hover:text-gray-300"}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Covers */}
              <div>
                {activeTab === "discover" && (
                  <WeeklyTracks
                    currentTrackId={currentCover.id}
                    isPlaying={isPlaying}
                    onTrackSelect={(trackId) => {
                      const trackIndex = coverOptions.findIndex((track) => track.id === trackId)
                      if (trackIndex !== -1) {
                        setCurrentIndex(trackIndex)
                        setIsPlaying(true)
                        setShowPlayerBar(true)
                      }
                    }}
                    onTogglePlay={() => setIsPlaying(!isPlaying)}
                    tracks={filteredCovers}
                  />
                )}
                {activeTab === "trending" && (
                  <WeeklyTracks
                    currentTrackId={currentCover.id}
                    isPlaying={isPlaying}
                    onTrackSelect={(trackId) => {
                      const trackIndex = coverOptions.findIndex((track) => track.id === trackId)
                      if (trackIndex !== -1) {
                        setCurrentIndex(trackIndex)
                        setIsPlaying(true)
                        setShowPlayerBar(true)
                      }
                    }}
                    onTogglePlay={() => setIsPlaying(!isPlaying)}
                    tracks={trendingCovers}
                  />
                )}
                {activeTab === "favourite" && (
                  <WeeklyTracks
                    currentTrackId={currentCover.id}
                    isPlaying={isPlaying}
                    onTrackSelect={(trackId) => {
                      const trackIndex = coverOptions.findIndex((track) => track.id === trackId)
                      if (trackIndex !== -1) {
                        setCurrentIndex(trackIndex)
                        setIsPlaying(true)
                        setShowPlayerBar(true)
                      }
                    }}
                    onTogglePlay={() => setIsPlaying(!isPlaying)}
                    tracks={favouriteCovers}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}