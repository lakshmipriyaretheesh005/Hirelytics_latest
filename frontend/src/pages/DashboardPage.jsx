import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../utils/apiClient';
import { motion } from 'framer-motion';
import {
  Building2,
  TrendingUp,
  Award,
  Star,
  ArrowRight,
  Briefcase,
  LogOut
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    companies: 0,
    drives: 0,
    applications: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Admins don't need onboarding
    if (user && user.role === 'admin') {
      navigate('/admin');
      return;
    }

    if (user && !user.onboardingCompleted) {
      navigate('/onboarding');
    } else {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [companiesRes, drivesRes, applicationsRes] = await Promise.all([
        apiClient.get('/companies/eligible'),
        apiClient.get('/drives'),
        apiClient.get('/drives/my-applications')
      ]);

      setStats({
        companies: companiesRes.data.count || 0,
        drives: drivesRes.data.count || 0,
        applications: applicationsRes.data.count || 0
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Hirelytics</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/notifications"
                className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
              >
                Notifications
              </Link>
              <Link
                to="/profile"
                className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 mb-8 shadow-2xl"
        >
          <div className="relative z-10">
            <h1 className="text-3xl font-black tracking-tight mb-2">
              Welcome back, {user?.fullName?.split(' ')[0]}!
            </h1>
            <p className="text-blue-100 font-medium mb-4">
              Your placement journey continues. Keep pushing forward!
            </p>
            <div className="flex flex-wrap gap-2">
              {user?.cgpa && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  CGPA: {user.cgpa}
                </span>
              )}
              {user?.branch && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  Branch: {user.branch}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Building2 className="text-blue-500" />}
            title="Eligible Companies"
            value={stats.companies}
            description="Matching your profile"
          />
          <StatCard
            icon={<TrendingUp className="text-emerald-500" />}
            title="Active Drives"
            value={stats.drives}
            description="Open for applications"
          />
          <StatCard
            icon={<Award className="text-amber-500" />}
            title="Applications"
            value={stats.applications}
            description="Drives participated"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ActionCard
            to="/companies"
            title="Companies"
            description="Explore companies"
            icon={<Building2 />}
          />
          <ActionCard
            to="/drives"
            title="Drives"
            description="View placement drives"
            icon={<Briefcase />}
          />
          <ActionCard
            to="/mock-tests"
            title="Mock Tests"
            description="Practice tests"
            icon={<Star />}
          />
          <ActionCard
            to="/profile"
            title="Profile"
            description="Update your details"
            icon={<Award />}
          />
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, description }) {
  return (
    <div className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm font-medium text-zinc-300">{title}</div>
      <div className="text-xs text-zinc-500 mt-1">{description}</div>
    </div>
  );
}

function ActionCard({ to, title, description, icon }) {
  return (
    <Link
      to={to}
      className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl rounded-xl p-6 hover:border-blue-600 transition-all group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-blue-600/20 text-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
          {icon}
        </div>
        <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-blue-500 transition-colors" />
      </div>
      <div className="text-lg font-semibold mb-1">{title}</div>
      <div className="text-sm text-zinc-500">{description}</div>
    </Link>
  );
}
