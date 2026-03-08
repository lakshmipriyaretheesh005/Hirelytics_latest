import React, { useState, useEffect } from 'react';
import { Users, Building2, Calendar, Bell, TrendingUp, Award } from 'lucide-react';
import apiClient from '../utils/apiClient';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCompanies: 4,
        activeDrives: 0,
        totalPlacements: 0,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch real stats from API
            const companiesRes = await apiClient.get('/companies');
            const drivesRes = await apiClient.get('/drives');

            setStats({
                totalStudents: 250, // This should come from API
                totalCompanies: companiesRes.data.companies?.length || 4,
                activeDrives: drivesRes.data.drives?.filter(d => d.status === 'active').length || 0,
                totalPlacements: 150, // This should come from API
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white mb-2">Admin Dashboard</h1>
                <p className="text-zinc-400">Manage your placement portal</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Users className="w-6 h-6" />}
                    label="Total Students"
                    value={stats.totalStudents}
                    color="blue"
                />
                <StatCard
                    icon={<Building2 className="w-6 h-6" />}
                    label="Companies"
                    value={stats.totalCompanies}
                    color="purple"
                />
                <StatCard
                    icon={<Calendar className="w-6 h-6" />}
                    label="Active Drives"
                    value={stats.activeDrives}
                    color="green"
                />
                <StatCard
                    icon={<Award className="w-6 h-6" />}
                    label="Total Placements"
                    value={stats.totalPlacements}
                    color="amber"
                />
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <QuickActionCard
                        title="Add Company"
                        description="Register a new recruiting company"
                        href="/admin/companies"
                        icon={<Building2 className="w-8 h-8" />}
                    />
                    <QuickActionCard
                        title="Create Drive"
                        description="Schedule a new placement drive"
                        href="/admin/drives"
                        icon={<Calendar className="w-8 h-8" />}
                    />
                    <QuickActionCard
                        title="Send Notification"
                        description="Notify students about updates"
                        href="/admin/notifications"
                        icon={<Bell className="w-8 h-8" />}
                    />
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                    <div className="space-y-4">
                        <ActivityItem
                            title="New company added"
                            description="TCS registered for campus placements"
                            time="2 hours ago"
                        />
                        <ActivityItem
                            title="Drive scheduled"
                            description="Infosys placement drive on March 15"
                            time="5 hours ago"
                        />
                        <ActivityItem
                            title="Student registered"
                            description="25 new students completed onboarding"
                            time="1 day ago"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }) {
    const colorClasses = {
        blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
        green: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    };

    return (
        <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="opacity-80">{icon}</div>
            </div>
            <p className="text-3xl font-black text-white mb-1">{value}</p>
            <p className="text-sm font-semibold opacity-80">{label}</p>
        </div>
    );
}

function QuickActionCard({ title, description, href, icon }) {
    return (
        <a href={href}>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-blue-500/50 transition-all cursor-pointer group">
                <div className="text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
                <p className="text-sm text-zinc-400">{description}</p>
            </div>
        </a>
    );
}

function ActivityItem({ title, description, time }) {
    return (
        <div className="flex items-start gap-4 pb-4 border-b border-zinc-800 last:border-0 last:pb-0">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <div className="flex-1">
                <p className="text-white font-semibold">{title}</p>
                <p className="text-sm text-zinc-400 mt-1">{description}</p>
            </div>
            <span className="text-xs text-zinc-500 flex-shrink-0">{time}</span>
        </div>
    );
}
