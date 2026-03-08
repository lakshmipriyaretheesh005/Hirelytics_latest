import React, { useState, useEffect } from 'react';
import { Search, Download, Mail } from 'lucide-react';
import apiClient from '../utils/apiClient';
import { toast } from 'sonner';

export default function AdminStudentsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterBranch, setFilterBranch] = useState('All');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            // This endpoint should be created in backend
            const res = await apiClient.get('/admin/students');
            setStudents(res.data.students || []);
        } catch (error) {
            console.error('Failed to fetch students');
            // Mock data for now
            setStudents([
                {
                    _id: '1',
                    fullName: 'John Doe',
                    email: 'john@example.com',
                    branch: 'CSE',
                    cgpa: 8.5,
                    semester: 7,
                    phone: '9876543210',
                    onboardingCompleted: true,
                },
                {
                    _id: '2',
                    fullName: 'Jane Smith',
                    email: 'jane@example.com',
                    branch: 'IT',
                    cgpa: 9.0,
                    semester: 7,
                    phone: '9876543211',
                    onboardingCompleted: true,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter((s) => {
        const matchesSearch = s.fullName.toLowerCase().includes(search.toLowerCase()) ||
            s.email.toLowerCase().includes(search.toLowerCase());
        const matchesBranch = filterBranch === 'All' || s.branch === filterBranch;
        return matchesSearch && matchesBranch;
    });

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Branch', 'CGPA', 'Semester', 'Phone'];
        const rows = filteredStudents.map(s => [
            s.fullName,
            s.email,
            s.branch,
            s.cgpa,
            s.semester,
            s.phone
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'students.csv';
        a.click();

        toast.success('Students data exported');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">Students Management</h1>
                    <p className="text-zinc-400">View and manage student profiles</p>
                </div>
                <button
                    onClick={exportToCSV}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
                <select
                    value={filterBranch}
                    onChange={(e) => setFilterBranch(e.target.value)}
                    className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                    <option>All</option>
                    <option>CSE</option>
                    <option>IT</option>
                    <option>ECE</option>
                    <option>EEE</option>
                    <option>Mechanical</option>
                </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                    <p className="text-zinc-400 text-sm mb-1">Total Students</p>
                    <p className="text-2xl font-bold text-white">{students.length}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                    <p className="text-zinc-400 text-sm mb-1">Onboarded</p>
                    <p className="text-2xl font-bold text-emerald-400">
                        {students.filter(s => s.onboardingCompleted).length}
                    </p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                    <p className="text-zinc-400 text-sm mb-1">Average CGPA</p>
                    <p className="text-2xl font-bold text-blue-400">
                        {(students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / students.length || 0).toFixed(2)}
                    </p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                    <p className="text-zinc-400 text-sm mb-1">Filtered Results</p>
                    <p className="text-2xl font-bold text-purple-400">{filteredStudents.length}</p>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-zinc-800/50 border-b border-zinc-700">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Student</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Branch</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">CGPA</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Semester</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Phone</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Status</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-zinc-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-zinc-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : filteredStudents.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-zinc-500">
                                    No students found
                                </td>
                            </tr>
                        ) : (
                            filteredStudents.map((student) => (
                                <tr key={student._id} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-white">{student.fullName}</p>
                                            <p className="text-sm text-zinc-400">{student.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 rounded">
                                            {student.branch}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-emerald-400 font-semibold">{student.cgpa}</span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-300">{student.semester}</td>
                                    <td className="px-6 py-4 text-zinc-300">{student.phone || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded ${student.onboardingCompleted
                                                ? 'bg-emerald-500/10 text-emerald-500'
                                                : 'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            {student.onboardingCompleted ? 'Complete' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => window.location.href = `mailto:${student.email}`}
                                                className="p-2 hover:bg-zinc-700 rounded-lg transition-colors text-blue-400"
                                                title="Send Email"
                                            >
                                                <Mail className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
