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
  Plus, 
  ShieldCheck, 
  Loader2,
  Trash2,
  Clock,
  Megaphone
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function AdminNotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchNotifications() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Admins see all notifications or maybe just their own?
      // For now, let's show their own notifications (e.g. system alerts)
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <ShieldCheck className="text-blue-500" />
            Admin Notifications
          </h1>
          <p className="text-zinc-400 text-lg">System alerts and administrative updates.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
            <Megaphone className="w-4 h-4 mr-2" />
            Send Global Broadcast
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className="border-zinc-800 bg-zinc-900/30 group relative overflow-hidden"
            >
              <CardContent className="p-5 flex gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-blue-500/10 ring-1 ring-blue-500/20">
                  <Bell className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 pr-10">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm text-white">
                      {notification.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-300">
                    {notification.message}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(notification.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => deleteNotification(notification.id)}
                  className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/5 rounded-md transition-all opacity-0 group-hover:opacity-100"
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
                <CardTitle className="text-zinc-400 font-bold">No admin notifications</CardTitle>
                <CardDescription className="text-zinc-600 max-w-xs mx-auto mt-2">
                    System logs and administrative alerts will appear here.
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
