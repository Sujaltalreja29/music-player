"use client"

import { Play, Pause } from "lucide-react"
import { motion } from "framer-motion"
import { coverOptions } from "../data/coverOptions"

interface WeeklyTracksProps {
  currentTrackId: number
  isPlaying: boolean
  onTrackSelect: (trackId: number) => void
  onTogglePlay: () => void
  tracks: {
    id: number
    title: string
    artist: string
    cover: string
    mood: string
    audio: string
    duration: string
    trending: boolean
  }[]
}


export function WeeklyTracks({ currentTrackId, isPlaying, onTrackSelect, onTogglePlay, tracks }: WeeklyTracksProps) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {tracks.slice(0, 5).map((track) => {
        const isCurrentTrack = track.id === currentTrackId


        return (
          <motion.div
            key={track.id}
            className={`flex items-center p-3 rounded-xl transition-colors ${
              isCurrentTrack ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-secondary/50"
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex-shrink-0 relative w-12 h-12 mr-4">
              <img
                src={track.cover || "/placeholder.svg"}
                alt={track.title}
                className="w-full h-full object-cover rounded-md"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 rounded-md transition-opacity">
                <button
                  className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center"
                  onClick={() => {
                    if (isCurrentTrack) {
                      onTogglePlay()
                    } else {
                      onTrackSelect(track.id)
                    }
                  }}
                >
                  {isCurrentTrack && isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                </button>
              </div>
            </div>

            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onTrackSelect(track.id)}>
              <h3 className={`font-medium truncate text-white ${isCurrentTrack ? "text-primary" : ""}`}>{track.title}</h3>
              <p className="text-sm text-gray-500 truncate">{track.artist}</p>
            </div>

            <div className="flex-shrink-0 text-sm text-gray-500 ml-4">{track.duration}</div>
          </motion.div>
        )
      })}
    </div>
  )
}
