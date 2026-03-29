import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import apiClient from '../utils/apiClient';
import { toast } from 'sonner';

export default function AdminDrivesPage() {
    const [drives, setDrives] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingDrive, setEditingDrive] = useState(null);

    useEffect(() => {
        fetchDrives();
        fetchCompanies();
    }, []);

    const fetchDrives = async () => {
        try {
            const res = await apiClient.get('/drives');
            setDrives(res.data.drives || []);
        } catch (error) {
            toast.error('Failed to fetch drives');
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanies = async () => {
        try {
            const res = await apiClient.get('/companies');
            setCompanies(res.data.companies || []);
        } catch (error) {
            toast.error('Failed to fetch companies');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this drive?')) return;

        try {
            await apiClient.delete(`/drives/${id}`);
            toast.success('Drive deleted successfully');
            fetchDrives();
        } catch (error) {
            toast.error('Failed to delete drive');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">Placement Drives</h1>
                    <p className="text-zinc-400">Manage placement drive schedules</p>
                </div>
                <button
                    onClick={() => {
                        setEditingDrive(null);
                        setShowForm(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create Drive
                </button>
            </div>

            {/* Drives Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-zinc-500 col-span-full text-center py-8">Loading...</p>
                ) : drives.length === 0 ? (
                    <p className="text-zinc-500 col-span-full text-center py-8">No drives scheduled</p>
                ) : (
                    drives.map((drive) => (
                        <DriveCard
                            key={drive._id}
                            drive={drive}
                            onEdit={() => {
                                setEditingDrive(drive);
                                setShowForm(true);
                            }}
                            onDelete={() => handleDelete(drive._id)}
                        />
                    ))
                )}
            </div>

            {/* Form Modal */}
            {showForm && (
                <DriveFormModal
                    drive={editingDrive}
                    companies={companies}
                    onClose={() => {
                        setShowForm(false);
                        setEditingDrive(null);
                    }}
                    onSuccess={() => {
                        setShowForm(false);
                        setEditingDrive(null);
                        fetchDrives();
                    }}
                />
            )}
        </div>
    );
}

function DriveCard({ drive, onEdit, onDelete }) {
    const statusColors = {
        upcoming: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        ongoing: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        completed: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-blue-500/50 transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">{drive.role || drive.title}</h3>
                        <p className="text-sm text-zinc-400">{drive.company?.name || 'General Drive'}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Date</span>
                    <span className="text-white font-semibold">
                        {drive.driveDate ? new Date(drive.driveDate).toLocaleDateString() : 'TBD'}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Registrations</span>
                    <span className="text-white font-semibold">
                        {drive.applicants?.length || 0} students
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Status</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded border ${statusColors[drive.status] || statusColors.upcoming
                        }`}>
                        {drive.status || 'Upcoming'}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-zinc-800">
                <button
                    onClick={onEdit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                    <Edit2 className="w-4 h-4" />
                    Edit
                </button>
                <button
                    onClick={onDelete}
                    className="px-3 py-2 bg-zinc-800 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

function DriveFormModal({ drive, companies, onClose, onSuccess }) {
    const mapJobTypeToUiType = (jobType, fallbackLocation) => {
        if (fallbackLocation) return fallbackLocation;
        if (jobType === 'Internship') return 'Off-Campus';
        if (jobType === 'Internship + FTE') return 'Virtual';
        return 'On-Campus';
    };

    const mapUiTypeToJobType = (type) => {
        if (type === 'Off-Campus') return 'Internship';
        if (type === 'Virtual') return 'Internship + FTE';
        return 'Full-time';
    };

    const [formData, setFormData] = useState({
        title: drive?.role || drive?.title || '',
        company: drive?.company?._id || drive?.company || '',
        date: drive?.driveDate
            ? new Date(drive.driveDate).toISOString().split('T')[0]
            : drive?.date
                ? new Date(drive.date).toISOString().split('T')[0]
                : '',
        packageOffered: drive?.packageOffered || '',
        type: mapJobTypeToUiType(drive?.jobType, drive?.location),
        status: drive?.status || 'upcoming',
        description: drive?.description || '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                company: formData.company,
                role: formData.title,
                driveDate: formData.date,
                location: formData.type,
                jobType: mapUiTypeToJobType(formData.type),
                status: formData.status,
                description: formData.description,
                packageOffered: formData.packageOffered?.trim() || 'TBD',
            };

            if (drive) {
                await apiClient.put(`/drives/${drive._id}`, payload);
                toast.success('Drive updated successfully');
            } else {
                await apiClient.post('/drives', payload);
                toast.success('Drive created successfully');
            }
            onSuccess();
        } catch (error) {
            toast.error(drive ? 'Failed to update drive' : 'Failed to create drive');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-2xl w-full">
                <div className="p-6 border-b border-zinc-800">
                    <h2 className="text-2xl font-bold text-white">
                        {drive ? 'Edit Drive' : 'Create Drive'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">
                            Company
                        </label>
                        <select
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            required
                        >
                            <option value="">Select Company</option>
                            {companies.map((company) => (
                                <option key={company._id} value={company._id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">
                            Package Offered
                        </label>
                        <input
                            type="text"
                            value={formData.packageOffered}
                            onChange={(e) => setFormData({ ...formData, packageOffered: e.target.value })}
                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            placeholder="e.g., 8 LPA"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-2">
                                Type
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                <option>On-Campus</option>
                                <option>Off-Campus</option>
                                <option>Virtual</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">
                            Status
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            rows="3"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            {drive ? 'Update' : 'Create'} Drive
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
