import  { useState } from "react"
import { ChevronDown } from "lucide-react"
import { moodOptions } from "../data/moodOptions"

interface MoodDropdownProps {
    selectedMood: (typeof moodOptions)[0]
    setSelectedMood: (mood: (typeof moodOptions)[0]) => void
}

export function MoodDropdown({ selectedMood, setSelectedMood }: MoodDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
            >
                <span className="font-medium" style={{color : "aliceblue"}}>{selectedMood.name} Mood</span>
                <ChevronDown size={16} />
            </button>

            {isOpen && (
                <div
                    className="absolute top-full left-0 mt-2 w-56 bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg overflow-hidden z-50"
                    onClick={() => setIsOpen(false)}
                >
                    {moodOptions.map((mood) => (
                        <button
                            key={mood.name}
                            onClick={() => setSelectedMood(mood)}
                            className={`w-full text-white text-left px-4 py-3 hover:bg-white/10 transition-colors ${selectedMood.name === mood.name ? "bg-white/10" : ""}`}
                        >
                            {mood.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}