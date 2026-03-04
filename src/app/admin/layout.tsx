'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { 
  LayoutDashboard, 
  Building2, 
  BookOpen, 
  Bell, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  GraduationCap,
  ShieldCheck,
  FileText,
  MessageSquare,
  BarChart3,
  Search,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profile?.role !== 'admin' && profile?.role !== 'coordinator') {
        router.push('/dashboard')
        return
      }
      setProfile(profile)
    }
    checkAdmin()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
    router.push('/login')
  }

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Companies', icon: Building2, href: '/admin/companies' },
    { name: 'Students', icon: Users, href: '/admin/students' },
    { name: 'Resources', icon: BookOpen, href: '/admin/resources' },
    { name: 'Drives', icon: BarChart3, href: '/admin/drives' },
    { name: 'Feedback', icon: MessageSquare, href: '/admin/feedback' },
    { name: 'Notifications', icon: Bell, href: '/admin/notifications' },
  ]

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed md:sticky top-0 left-0 h-screen bg-[#09090b] border-r border-zinc-800 z-50 transition-all duration-300 overflow-hidden flex flex-col justify-between",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div>
          <div className="p-6 flex items-center justify-between border-b border-zinc-800 h-16">
            {isSidebarOpen ? (
              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <ShieldCheck className="text-white w-5 h-5" />
                </div>
                <span className="text-lg font-black tracking-tight text-white uppercase tracking-widest">ADMIN</span>
              </Link>
            ) : (
              <ShieldCheck className="text-blue-500 w-6 h-6 mx-auto" />
            )}
          </div>

          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-bold text-xs uppercase tracking-widest",
                  pathname === item.href 
                    ? "bg-blue-600 text-white" 
                    : "text-zinc-500 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <item.icon className="w-5 h-5" />
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-800 space-y-2">
          <Link 
            href="/admin/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-bold text-xs uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-zinc-800/50",
              pathname === '/admin/settings' && "bg-zinc-800 text-white"
            )}
          >
            <Settings className="w-5 h-5" />
            {isSidebarOpen && <span>Settings</span>}
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-bold text-xs uppercase tracking-widest text-red-500/80 hover:text-red-400 hover:bg-red-400/5 w-full"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-md"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-zinc-500">
              <Link href="/admin" className="hover:text-white transition-colors uppercase tracking-widest">Admin</Link>
              <span>/</span>
              <span className="text-zinc-300 uppercase tracking-widest">{pathname.split('/').pop() || 'Dashboard'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 hidden md:flex">
              <Plus className="w-4 h-4 mr-1.5" /> Quick Post
            </Button>
            <Avatar className="h-9 w-9 border border-zinc-800">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-zinc-800 text-zinc-300 font-bold">{profile?.full_name?.charAt(0) || 'A'}</AvatarFallback>
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
