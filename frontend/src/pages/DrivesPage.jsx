import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { toast } from 'sonner';
import { Briefcase, Calendar, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

export default function DrivesPage() {
  const [drives, setDrives] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchDrives();
    fetchMyApplications();
  }, []);

  const fetchDrives = async () => {
    try {
      const response = await apiClient.get('/drives');
      setDrives(response.data.drives || []);
    } catch (error) {
      console.error('Failed to fetch drives:', error);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const response = await apiClient.get('/drives/my-applications');
      setMyApplications(response.data.applications || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (driveId) => {
    try {
      await apiClient.post(`/drives/${driveId}/apply`);
      toast.success('Applied successfully!');
      fetchMyApplications();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to apply');
    }
  };

  const isApplied = (driveId) => {
    return myApplications.some(app => app.drive._id === driveId);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-zinc-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold">Placement Drives</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            All Drives
          </button>
          <button
            onClick={() => setActiveTab('applied')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'applied'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            My Applications ({myApplications.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'all' ? (
          <div className="space-y-4">
            {drives.map((drive) => (
              <div
                key={drive._id}
                className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <Briefcase className="w-5 h-5 text-blue-500" />
                      <h3 className="text-xl font-semibold">{drive.role}</h3>
                    </div>
                    <p className="text-zinc-400">{drive.company?.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-emerald-500">
                      {drive.packageOffered}
                    </div>
                    {drive.driveDate && (
                      <div className="text-sm text-zinc-400 mt-1">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {format(new Date(drive.driveDate), 'MMM dd, yyyy')}
                      </div>
                    )}
                  </div>
                </div>

                {drive.description && (
                  <p className="text-zinc-400 mb-4">{drive.description}</p>
                )}

                <button
                  onClick={() => handleApply(drive._id)}
                  disabled={isApplied(drive._id)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {isApplied(drive._id) ? 'Already Applied' : 'Apply Now'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {myApplications.map((application) => (
              <div
                key={application.drive._id}
                className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      {application.drive.role}
                    </h3>
                    <p className="text-zinc-400 mb-2">
                      {application.drive.company?.name}
                    </p>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      application.status === 'selected'
                        ? 'bg-emerald-600/20 text-emerald-400'
                        : application.status === 'shortlisted'
                        ? 'bg-blue-600/20 text-blue-400'
                        : application.status === 'rejected'
                        ? 'bg-red-600/20 text-red-400'
                        : 'bg-zinc-600/20 text-zinc-400'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-emerald-500">
                      {application.drive.packageOffered}
                    </div>
                    <div className="text-sm text-zinc-400 mt-1">
                      Applied: {format(new Date(application.appliedAt), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {myApplications.length === 0 && (
              <div className="text-center py-12 text-zinc-400">
                You haven't applied to any drives yet
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
