"use client"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import { SideNav } from "./components/SideNav"
import { HomePage } from "./pages/Home"
import { PlayerBar } from "./components/PlayerBar"
import { CoverPage } from "./Features/CoverPage"
import { coverOptions } from "./data/coverOptions"

export default function MusicPlayer() {
  const [activeTab, setActiveTab] = useState("discover")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentCover, setCurrentCover] = useState(coverOptions[0])
  const [showCoverPage, setShowCoverPage] = useState(false)
  const [showPlayerBar, setShowPlayerBar] = useState(false) // New state to control player bar visibility
  const [volume, setVolume] = useState(0.5) // Default volume at 50%
  const [isMuted, setIsMuted] = useState(false)
  const [selectedMood, setSelectedMood] = useState({
    name: "Default",
    gradient: "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800",
    visualizerColors: ["#6b7280", "#8b5cf6", "#7c3aed"],
  })
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Update current cover when index changes
  useEffect(() => {
    setCurrentCover(coverOptions[currentIndex])
  }, [currentIndex])

  // Auto-play/pause music
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Playback failed:", e)
          setIsPlaying(false)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentCover.audio])

  // Show player bar when playback starts
  useEffect(() => {
    if (isPlaying) {
      setShowPlayerBar(true)
    }
  }, [isPlaying])

  // Auto adjust volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Play next song and auto-play
  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % coverOptions.length
    setCurrentIndex(nextIndex)
    setIsPlaying(false) // Prevents weird playback bugs
    setTimeout(() => setIsPlaying(true), 100) // Ensures the new song starts
  }

  // Play previous song and auto-play
  const handlePrevious = () => {
    const prevIndex = currentIndex === 0 ? coverOptions.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    setIsPlaying(false)
    setTimeout(() => setIsPlaying(true), 100)
  }

  // Mute/Unmute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }
  
  // Handle closing cover page
  const handleCloseCoverPage = () => {
    setShowCoverPage(false)
  }
  
  // Handle changing cover
  const handleChangeCover = (cover: any) => {
    const newIndex = coverOptions.findIndex(c => c.id === cover.id)
    if (newIndex !== -1) {
      setCurrentIndex(newIndex)
    }
  }

  return (
    <>
      <HomePage
        currentCover={currentCover}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        setCurrentIndex={setCurrentIndex}
        setShowPlayerBar={setShowPlayerBar}
        setShowCoverPage={setShowCoverPage}
      />

      {/* Only show player bar if showPlayerBar is true */}
      {showPlayerBar && (
        <PlayerBar
          currentCover={currentCover}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          setShowCoverPage={setShowCoverPage}
          audioRef={audioRef}
          onNext={handleNext}
          onPrevious={handlePrevious}
          volume={volume}
          setVolume={setVolume}
          isMuted={isMuted}
          toggleMute={toggleMute}
        />
      )}

      {/* 🎵 Audio Player (Hidden) */}
      <audio 
        ref={audioRef} 
        src={currentCover.audio}
        onEnded={handleNext} // Automatically play next song when current one ends
      />

      <AnimatePresence>
        {showCoverPage && (
          <CoverPage
            currentCover={currentCover}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            onClose={handleCloseCoverPage}
            onChangeCover={handleChangeCover}
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
            audioRef={audioRef}
            onNext={handleNext}
            onPrevious={handlePrevious}
            volume={volume}
            setVolume={setVolume}
            isMuted={isMuted}
            toggleMute={toggleMute}
          />
        )}
      </AnimatePresence>
    </>
  )
}