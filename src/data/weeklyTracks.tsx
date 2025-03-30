import { motion } from "framer-motion";
import { Play, Pause, Clock } from "lucide-react";
import { coverOptions } from "./coverOptions";

interface WeeklyTracksProps {
  currentTrackId?: number;
  isPlaying: boolean;
  onTrackSelect: (trackId: number) => void;
  onTogglePlay: () => void;
}

export function WeeklyTracks({ 
  currentTrackId, 
  isPlaying, 
  onTrackSelect, 
  onTogglePlay 
}: WeeklyTracksProps) {
  // Format duration - in a real app you'd get this from audio metadata
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="mb-32">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Weekly Top Tracks</h2>
        <button className="text-sm text-white/70 hover:text-white">See All</button>
      </div>

      <div className="bg-black/20 backdrop-blur-md rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 px-6 py-4 border-b border-white/10 text-white/60 text-sm">
          <div className="col-span-1">#</div>
          <div className="col-span-5">TITLE</div>
          <div className="col-span-3">ARTIST</div>
          <div className="col-span-2">MOOD</div>
          <div className="col-span-1 flex justify-end">
            <Clock size={16} />
          </div>
        </div>

        {/* Table Body */}
        {coverOptions.map((track, index) => {
          const isCurrentTrack = currentTrackId === track.id;
          const isCurrentlyPlaying = isCurrentTrack && isPlaying;

          return (
            <motion.div
              key={track.id}
              className={`grid grid-cols-12 px-6 py-4 items-center hover:bg-white/5 cursor-pointer ${
                isCurrentTrack ? "bg-white/10" : ""
              }`}
              onClick={() => {
                if (isCurrentTrack) {
                  onTogglePlay();
                } else {
                  onTrackSelect(track.id);
                }
              }}
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="col-span-1 relative group">
                <span className={`${isCurrentTrack ? "text-white" : "text-white/70"} group-hover:opacity-0`}>
                  {index + 1}
                </span>
                <div className="absolute inset-0 flex items-center justify-start opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCurrentTrack) {
                        onTogglePlay();
                      } else {
                        onTrackSelect(track.id);
                      }
                    }}
                    className="text-white"
                  >
                    {isCurrentlyPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                </div>
              </div>

              <div className="col-span-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                  <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                </div>
                <span className={isCurrentTrack ? "font-medium" : ""}>{track.title}</span>
              </div>

              <div className="col-span-3 text-white/70">{track.artist}</div>
              <div className="col-span-2">
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs">{track.mood}</span>
              </div>
              <div className="col-span-1 text-white/60 text-right">
                {/* Example duration - replace with actual duration */}
                {formatDuration(Math.floor(Math.random() * 180) + 120)}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}