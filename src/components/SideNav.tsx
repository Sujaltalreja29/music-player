import {
    Headphones,
    Home,
    Library,
    Heart
} from "lucide-react";

interface SideNavProps {
    setActiveTab: (tab: string) => void;  // Accept function to change activeTab
}

export function SideNav({ setActiveTab }: SideNavProps) {
    return (
        <div className="fixed left-0 top-0 h-full w-64 bg-black/30 backdrop-blur-xl p-6 border-r border-white/10 z-10">
            <div className="flex items-center gap-2 mb-12">
                <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
                    <Headphones size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold">Harmony</span>
            </div>

            <nav className="space-y-8">
                <div className="space-y-3">
                    <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Menu</p>
                    <div className="space-y-1">
                        {/* Home -> Discover */}
                        <button
                            onClick={() => setActiveTab("discover")}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-white rounded-lg bg-white/10"
                        >
                            <Home size={18} />
                            <span>Home</span>
                        </button>

                        {/* Trending */}
                        <button
                            onClick={() => setActiveTab("trending")}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <Library size={18} />
                            <span>Trending</span>
                        </button>

                        {/* Favorites (Add this section in HomePage first) */}
                        <button
                            onClick={() => setActiveTab("favorites")}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <Heart size={18} />
                            <span>Favorites</span>
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
}
