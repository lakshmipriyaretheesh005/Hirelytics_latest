'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { 
  LayoutDashboard, 
  Building2, 
  BookOpen, 
  FileText, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
    Menu, 
    X,
    GraduationCap,
    Trophy,
    PieChart,
    Search,
    BrainCircuit
  } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (!profile?.onboarding_completed) {
        router.push('/onboarding')
        return
      }
      setProfile(profile)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
    router.push('/login')
  }

    const menuItems = [
      { name: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
      { name: 'Companies', icon: Building2, href: '/companies' },
      { name: 'AI Predictor', icon: BrainCircuit, href: '/predict' },
      { name: 'Prep Hub', icon: BookOpen, href: '/prep-hub' },
      { name: 'Mock Tests', icon: Trophy, href: '/mock-tests' },
      { name: 'Resume Builder', icon: FileText, href: '/resume' },
      { name: 'Notifications', icon: Bell, href: '/notifications' },
    ]


  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed md:sticky top-0 left-0 h-screen bg-zinc-900 border-r border-zinc-800 z-50 transition-all duration-300 overflow-hidden flex flex-col justify-between",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div>
          <div className="p-6 flex items-center justify-between border-b border-zinc-800 h-16">
            {isSidebarOpen ? (
              <Link href="/" className="flex items-center gap-2 group">
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
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm group",
                  pathname === item.href 
                    ? "bg-blue-600/10 text-blue-500" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-blue-500" : "text-zinc-500 group-hover:text-zinc-300")} />
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-800 space-y-2">
          <Link 
            href="/profile"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50",
              pathname === '/profile' && "bg-blue-600/10 text-blue-500"
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Header */}
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
                placeholder="Search companies, prep kits, resources..." 
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-blue-400">Score: 840</span>
            </div>
            <Avatar className="h-9 w-9 border border-zinc-800">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-blue-600 text-white font-bold">{profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
