'use client'

import { Menu, Search, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { useAuth } from '../context/AuthContext'

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { user } = useAuth()

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-md"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div className="relative hidden lg:block w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            placeholder="Search companies, tests, resources..."
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
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
