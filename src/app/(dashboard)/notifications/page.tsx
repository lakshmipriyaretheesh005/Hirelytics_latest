'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Calendar, 
  Trophy, 
  Briefcase,
  Loader2,
  Trash2,
  Clock
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMarkingAll, setIsMarkingAll] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function fetchNotifications() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Failed to load notifications')
      } else {
        setNotifications(data || [])
      }
      setIsLoading(false)
    }
    fetchNotifications()
  }, [])

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)

    if (error) {
      toast.error('Error updating notification')
    } else {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      )
    }
  }

  const markAllAsRead = async () => {
    setIsMarkingAll(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)

    if (error) {
      toast.error('Error updating notifications')
    } else {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      toast.success('All notifications marked as read')
    }
    setIsMarkingAll(false)
  }

  const deleteNotification = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Error deleting notification')
    } else {
      setNotifications(prev => prev.filter(n => n.id !== id))
      toast.success('Notification removed')
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'application': return <Briefcase className="w-5 h-5 text-blue-500" />
      case 'mock_test': return <Trophy className="w-5 h-5 text-amber-500" />
      case 'event': return <Calendar className="w-5 h-5 text-purple-500" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />
      default: return <Info className="w-5 h-5 text-zinc-400" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-zinc-400 text-lg">Stay updated with your latest activities and opportunities.</p>
        </div>
        {unreadCount > 0 && (
          <Button 
            onClick={markAllAsRead} 
            disabled={isMarkingAll}
            variant="outline" 
            className="border-zinc-800 hover:bg-zinc-800 text-zinc-300"
          >
            {isMarkingAll ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={cn(
                "border-zinc-800 transition-all duration-200 group relative overflow-hidden",
                notification.is_read ? "bg-zinc-900/30 opacity-70" : "bg-zinc-900/60 border-l-4 border-l-blue-600 shadow-lg shadow-blue-900/10"
              )}
            >
              <CardContent className="p-5 flex gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  notification.is_read ? "bg-zinc-800" : "bg-zinc-800/80 ring-1 ring-zinc-700/50"
                )}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 pr-10">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={cn("font-bold text-sm", notification.is_read ? "text-zinc-400" : "text-white")}>
                      {notification.title}
                    </h3>
                  </div>
                  <p className={cn("text-sm leading-relaxed", notification.is_read ? "text-zinc-500" : "text-zinc-300")}>
                    {notification.message}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(notification.created_at).toLocaleDateString()} at {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {!notification.is_read && (
                        <button 
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-500 hover:text-blue-400 transition-colors"
                        >
                            Mark as read
                        </button>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => deleteNotification(notification.id)}
                  className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/5 rounded-md transition-all md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-zinc-800 bg-zinc-900/30 border-dashed py-20">
            <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                <Bell className="w-8 h-8 text-zinc-600" />
              </div>
              <div>
                <CardTitle className="text-zinc-400 font-bold">No notifications yet</CardTitle>
                <CardDescription className="text-zinc-600 max-w-xs mx-auto mt-2">
                  When you have updates regarding your applications, tests, or account, they'll appear here.
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
