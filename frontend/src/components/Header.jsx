'use client'

import { Menu, Search, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { useAuth } from '../context/AuthContext'

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { user } = useAuth()

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-md"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div className="relative hidden md:block flex-1 max-w-4xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
          <input
            placeholder="Search companies, tests, resources..."
            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-12 pr-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/profile" className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/60" aria-label="Open profile">
          <div className="h-9 w-9 bg-blue-600 rounded-full border border-zinc-800 hover:border-blue-500 transition-colors flex items-center justify-center text-white font-bold text-sm">
            {(user?.fullName || user?.full_name || 'U').charAt(0).toUpperCase()}
          </div>
        </Link>
      </div>
    </header>
  )
}

export default Header
