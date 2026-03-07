import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import {
  Bell,
  Check,
  CheckCircle2,
  AlertCircle,
  Info,
  Calendar,
  Trophy,
  Briefcase,
  Trash2,
  Clock,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get('/notifications');
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setIsMarkingAll(true);
      await apiClient.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await apiClient.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'application':
        return <Briefcase className="w-5 h-5 text-blue-500" />;
      case 'mock_test':
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'event':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-zinc-400" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
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
          <button
            onClick={markAllAsRead}
            disabled={isMarkingAll}
            className="inline-flex items-center px-4 py-2 rounded-md border border-zinc-800 hover:bg-zinc-800 text-zinc-300 disabled:opacity-60"
          >
            {isMarkingAll ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="border border-zinc-800 bg-zinc-900/30 border-dashed py-20 rounded-xl">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
              <Bell className="w-8 h-8 text-zinc-600" />
            </div>
            <div>
              <p className="text-zinc-300 font-bold">No notifications yet</p>
              <p className="text-zinc-600 max-w-xs mx-auto mt-2">
                Updates about applications, tests, and account activity will appear here.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={cn(
                'border border-zinc-800 transition-all duration-200 group relative overflow-hidden rounded-xl',
                notification.isRead ? 'bg-zinc-900/30 opacity-70' : 'bg-zinc-900/60 border-l-4 border-l-blue-600 shadow-lg shadow-blue-900/10'
              )}
            >
              <div className="p-5 flex gap-4">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                    notification.isRead ? 'bg-zinc-800' : 'bg-zinc-800/80 ring-1 ring-zinc-700/50'
                  )}
                >
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 pr-10">
                  <h3 className={cn('font-bold text-sm mb-1', notification.isRead ? 'text-zinc-400' : 'text-white')}>
                    {notification.title}
                  </h3>
                  <p className={cn('text-sm leading-relaxed', notification.isRead ? 'text-zinc-500' : 'text-zinc-300')}>
                    {notification.message}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                    </span>
                    {!notification.isRead && (
                      <button onClick={() => markAsRead(notification._id)} className="text-blue-500 hover:text-blue-400 transition-colors">
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="ml-1 p-2 text-zinc-400 hover:text-white transition-colors"
                    aria-label="Mark as read"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification._id)}
                  className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/5 rounded-md transition-all md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
