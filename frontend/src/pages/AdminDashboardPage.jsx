import React, { useState, useEffect } from 'react';
import { Users, Building2, Calendar, Bell, Award, Pencil, Check, X } from 'lucide-react';
import apiClient from '../utils/apiClient';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCompanies: 0,
        activeDrives: 0,
        totalPlacements: 0,
    });
    const [editingPlacements, setEditingPlacements] = useState(false);
    const [placementsInput, setPlacementsInput] = useState('0');
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [companiesRes, drivesRes, studentsRes] = await Promise.all([
                apiClient.get('/companies'),
                apiClient.get('/drives'),
                apiClient.get('/profile/students'),
            ]);

            const companies = companiesRes.data.companies || [];
            const drives = drivesRes.data.drives || [];
            const students = studentsRes.data.students || [];

            const activeDrivesCount = drives.filter(
                (d) => d.status !== 'completed' && d.status !== 'cancelled'
            ).length;

            const savedPlacements = localStorage.getItem('adminTotalPlacements');
            const derivedPlacements = companies.reduce(
                (sum, company) => sum + (company.studentPlaced || 0),
                0
            );
            const totalPlacements = savedPlacements !== null ? Number(savedPlacements) : derivedPlacements;

            const onboardingRecently = students.filter((student) => {
                if (!student.onboardingCompleted || !student.updatedAt) return false;
                const updated = new Date(student.updatedAt).getTime();
                const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
                return updated >= oneDayAgo;
            }).length;

            const latestDrive = drives
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
            const latestCompany = companies
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

            const activity = [];
            if (latestCompany) {
                activity.push({
                    title: 'New company added',
                    description: `${latestCompany.name} registered for campus placements`,
                    time: formatRelativeTime(latestCompany.createdAt),
                });
            }
            if (latestDrive) {
                activity.push({
                    title: 'Drive scheduled',
                    description: `${latestDrive.role || 'New drive'} scheduled${latestDrive.driveDate ? ` for ${new Date(latestDrive.driveDate).toLocaleDateString()}` : ''}`,
                    time: formatRelativeTime(latestDrive.createdAt),
                });
            }
            activity.push({
                title: 'Student onboarding',
                description: `${onboardingRecently} students completed onboarding in the last 24 hours`,
                time: 'Live',
            });

            setRecentActivity(activity);

            setStats({
                totalStudents: students.length,
                totalCompanies: companies.length,
                activeDrives: activeDrivesCount,
                totalPlacements,
            });
            setPlacementsInput(String(totalPlacements));
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const savePlacements = () => {
        const parsed = Number(placementsInput);
        if (Number.isNaN(parsed) || parsed < 0) return;
        localStorage.setItem('adminTotalPlacements', String(parsed));
        setStats((prev) => ({ ...prev, totalPlacements: parsed }));
        setEditingPlacements(false);
    };

    const cancelPlacementsEdit = () => {
        setPlacementsInput(String(stats.totalPlacements));
        setEditingPlacements(false);
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
                    editable
                    editing={editingPlacements}
                    editValue={placementsInput}
                    onEditStart={() => setEditingPlacements(true)}
                    onEditChange={setPlacementsInput}
                    onEditSave={savePlacements}
                    onEditCancel={cancelPlacementsEdit}
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
                        {recentActivity.map((item, idx) => (
                            <ActivityItem
                                key={`${item.title}-${idx}`}
                                title={item.title}
                                description={item.description}
                                time={item.time}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
    color,
    editable,
    editing,
    editValue,
    onEditStart,
    onEditChange,
    onEditSave,
    onEditCancel,
}) {
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
                {editable && !editing && (
                    <button
                        type="button"
                        onClick={onEditStart}
                        className="text-zinc-300 hover:text-white transition-colors"
                        title="Edit value"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                )}
            </div>
            {editable && editing ? (
                <div className="mb-1 flex items-center gap-2">
                    <input
                        type="number"
                        min="0"
                        value={editValue}
                        onChange={(e) => onEditChange(e.target.value)}
                        className="w-24 px-2 py-1 text-xl font-black bg-zinc-900/40 border border-zinc-700 rounded text-white"
                    />
                    <button type="button" onClick={onEditSave} className="text-emerald-400 hover:text-emerald-300">
                        <Check className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={onEditCancel} className="text-red-400 hover:text-red-300">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <p className="text-3xl font-black text-white mb-1">{value}</p>
            )}
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

function formatRelativeTime(dateString) {
    if (!dateString) return 'Recently';
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
}
