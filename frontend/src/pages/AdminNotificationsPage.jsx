import React, { useState } from 'react';
import { Send, Bell } from 'lucide-react';
import apiClient from '../utils/apiClient';
import { toast } from 'sonner';

export default function AdminNotificationsPage() {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'info',
        targetAudience: 'all',
    });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        try {
            await apiClient.post('/notifications', formData);
            toast.success('Notification sent successfully');
            setFormData({
                title: '',
                message: '',
                type: 'info',
                targetAudience: 'all',
            });
        } catch (error) {
            toast.error('Failed to send notification');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white mb-2">Send Notifications</h1>
                <p className="text-zinc-400">Broadcast messages to students</p>
            </div>

            {/* Form */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">
                            Notification Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., New Placement Drive Announced"
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">
                            Message
                        </label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Enter your message here..."
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            rows="6"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-2">
                                Type
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                <option value="info">Info</option>
                                <option value="success">Success</option>
                                <option value="warning">Warning</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-2">
                                Target Audience
                            </label>
                            <select
                                value={formData.targetAudience}
                                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                <option value="all">All Students</option>
                                <option value="cse">CSE Only</option>
                                <option value="it">IT Only</option>
                                <option value="ece">ECE Only</option>
                                <option value="eligible">Eligible Students</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setFormData({ title: '', message: '', type: 'info', targetAudience: 'all' })}
                            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Clear
                        </button>
                        <button
                            type="submit"
                            disabled={sending}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            {sending ? 'Sending...' : 'Send Notification'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Preview */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4">Preview</h2>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                    <div className="flex gap-4">
                        <div className={`p-3 rounded-lg ${formData.type === 'info' ? 'bg-blue-500/10 text-blue-400' :
                                formData.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                                    formData.type === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                                        'bg-red-500/10 text-red-400'
                            }`}>
                            <Bell className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-white text-lg mb-2">
                                {formData.title || 'Notification Title'}
                            </h3>
                            <p className="text-zinc-300">
                                {formData.message || 'Your message will appear here...'}
                            </p>
                            <p className="text-xs text-zinc-500 mt-3">
                                Target: {formData.targetAudience === 'all' ? 'All Students' : formData.targetAudience.toUpperCase()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
