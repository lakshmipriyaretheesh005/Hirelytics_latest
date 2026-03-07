'use client'

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Building2, 
  BrainCircuit,
  BookOpen, 
  Trophy,
  Bell, 
  User, 
  LogOut,
  GraduationCap,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cn } from '../lib/utils'

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Companies', icon: Building2, href: '/companies' },
    { name: 'AI Predictor', icon: BrainCircuit, href: '/dashboard' },
    { name: 'Prep Hub', icon: BookOpen, href: '/dashboard' },
    { name: 'Drives', icon: Trophy, href: '/drives' },
    { name: 'Mock Tests', icon: Trophy, href: '/mock-tests' },
    { name: 'Notifications', icon: Bell, href: '/notifications' },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside 
      className={cn(
        "fixed md:sticky top-0 left-0 h-screen bg-zinc-900 border-r border-zinc-800 z-50 transition-all duration-300 overflow-hidden flex flex-col justify-between",
        isSidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div>
        <div className="p-6 flex items-center justify-between border-b border-zinc-800 h-16">
          {isSidebarOpen ? (
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <GraduationCap className="text-white w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-white uppercase tracking-widest">Hirelytics</span>
            </Link>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mx-auto">
              <GraduationCap className="text-white w-5 h-5" />
            </div>
          )}
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm group",
                location.pathname === item.href 
                  ? "bg-blue-600/10 text-blue-500" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              )}
            >
              <item.icon className={cn("w-5 h-5", location.pathname === item.href ? "text-blue-500" : "text-zinc-500 group-hover:text-zinc-300")} />
              {isSidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-800 space-y-2 mt-auto">
        <Link 
          to="/profile"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50",
            location.pathname === '/profile' && "bg-blue-600/10 text-blue-500"
          )}
        >
          <User className="w-5 h-5" />
          {isSidebarOpen && <span>Profile</span>}
        </Link>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm text-red-400/80 hover:text-red-400 hover:bg-red-400/5 w-full"
        >
          <LogOut className="w-5 h-5" />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
