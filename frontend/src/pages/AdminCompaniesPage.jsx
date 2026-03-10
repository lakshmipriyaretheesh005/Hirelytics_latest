import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import apiClient from '../utils/apiClient';
import { toast } from 'sonner';

export default function AdminCompaniesPage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const res = await apiClient.get('/companies');
            setCompanies(res.data.companies || []);
        } catch (error) {
            toast.error('Failed to fetch companies');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this company?')) return;

        try {
            await apiClient.delete(`/companies/${id}`);
            toast.success('Company deleted successfully');
            fetchCompanies();
        } catch (error) {
            toast.error('Failed to delete company');
        }
    };

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">Companies Management</h1>
                    <p className="text-zinc-400">Manage recruiting companies</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCompany(null);
                        setShowForm(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Company
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <input
                    type="text"
                    placeholder="Search companies..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
            </div>

            {/* Companies Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-zinc-800/50 border-b border-zinc-700">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Company</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Industry</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Package</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Min CGPA</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-300">Status</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-zinc-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-zinc-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : filteredCompanies.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-zinc-500">
                                    No companies found
                                </td>
                            </tr>
                        ) : (
                            filteredCompanies.map((company) => (
                                <tr key={company._id} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                                                {company.logo || company.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{company.name}</p>
                                                <p className="text-sm text-zinc-400">{company.website}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-300">{company.industry}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-emerald-400 font-semibold">
                                            {company.averagePackage || company.roles?.[0]?.package || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-300">
                                        {company.eligibility?.minCGPA || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded ${company.isActive
                                            ? 'bg-emerald-500/10 text-emerald-500'
                                            : 'bg-red-500/10 text-red-500'
                                            }`}>
                                            {company.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingCompany(company);
                                                    setShowForm(true);
                                                }}
                                                className="p-2 hover:bg-zinc-700 rounded-lg transition-colors text-blue-400"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(company._id)}
                                                className="p-2 hover:bg-zinc-700 rounded-lg transition-colors text-red-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Form Modal */}
            {showForm && (
                <CompanyFormModal
                    company={editingCompany}
                    onClose={() => {
                        setShowForm(false);
                        setEditingCompany(null);
                    }}
                    onSuccess={() => {
                        setShowForm(false);
                        setEditingCompany(null);
                        fetchCompanies();
                    }}
                />
            )}
        </div>
    );
}

function CompanyFormModal({ company, onClose, onSuccess }) {
    const [activeTab, setActiveTab] = useState('basic');
    const [formData, setFormData] = useState({
        // Basic Info
        name: company?.name || '',
        logo: company?.logo || '',
        industry: company?.industry || '',
        description: company?.description || '',
        website: company?.website || '',

        // Eligibility
        eligibility: {
            minCGPA: company?.eligibility?.minCGPA || 0,
            branches: company?.eligibility?.branches || [],
            backlogAllowed: company?.eligibility?.backlogAllowed || false,
            yearOfPassing: company?.eligibility?.yearOfPassing || new Date().getFullYear(),
        },

        // Roles
        roles: company?.roles || [],

        // Selection Process
        selectionProcess: {
            rounds: company?.selectionProcess?.rounds || [],
        },

        // Topics
        aptitudeTopics: company?.aptitudeTopics || [],
        technicalTopics: company?.technicalTopics || [],
        codingLanguages: company?.codingLanguages || [],

        // Questions
        hrQuestions: company?.hrQuestions || [],
        sampleQuestions: company?.sampleQuestions || [],

        // Statistics
        interviewTimeline: company?.interviewTimeline || '',
        averagePackage: company?.averagePackage || '',
        studentPlaced: company?.studentPlaced || 0,
        previouslyVisited: company?.previouslyVisited || false,

        // Status
        isActive: company?.isActive ?? true,
    });

    const [newBranch, setNewBranch] = useState('');
    const [newTopic, setNewTopic] = useState('');
    const [newLanguage, setNewLanguage] = useState('');
    const [newHRQuestion, setNewHRQuestion] = useState('');

    const tabs = [
        { id: 'basic', label: 'Basic Info' },
        { id: 'eligibility', label: 'Eligibility' },
        { id: 'roles', label: 'Roles' },
        { id: 'selection', label: 'Selection Process' },
        { id: 'topics', label: 'Topics' },
        { id: 'questions', label: 'Interview & Coding Qs' },
        { id: 'statistics', label: 'Statistics' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (company) {
                await apiClient.put(`/companies/${company._id}`, formData);
                toast.success('Company updated successfully');
            } else {
                await apiClient.post('/companies', formData);
                toast.success('Company added successfully');
            }
            onSuccess();
        } catch (error) {
            toast.error(company ? 'Failed to update company' : 'Failed to add company');
        }
    };

    // Array management helpers
    const addBranch = () => {
        if (newBranch.trim()) {
            setFormData({
                ...formData,
                eligibility: {
                    ...formData.eligibility,
                    branches: [...formData.eligibility.branches, newBranch.trim()]
                }
            });
            setNewBranch('');
        }
    };

    const removeBranch = (index) => {
        setFormData({
            ...formData,
            eligibility: {
                ...formData.eligibility,
                branches: formData.eligibility.branches.filter((_, i) => i !== index)
            }
        });
    };

    const addRole = () => {
        setFormData({
            ...formData,
            roles: [...formData.roles, { title: '', type: '', package: '', description: '' }]
        });
    };

    const updateRole = (index, field, value) => {
        const updatedRoles = [...formData.roles];
        updatedRoles[index][field] = value;
        setFormData({ ...formData, roles: updatedRoles });
    };

    const removeRole = (index) => {
        setFormData({
            ...formData,
            roles: formData.roles.filter((_, i) => i !== index)
        });
    };

    const addRound = () => {
        setFormData({
            ...formData,
            selectionProcess: {
                rounds: [
                    ...formData.selectionProcess.rounds,
                    {
                        name: '',
                        duration: '',
                        sections: [],
                        cutoff: '',
                        topics: [],
                        difficulty: 'Medium',
                        description: ''
                    }
                ]
            }
        });
    };

    const updateRound = (index, field, value) => {
        const updatedRounds = [...formData.selectionProcess.rounds];
        updatedRounds[index][field] = value;
        setFormData({
            ...formData,
            selectionProcess: { rounds: updatedRounds }
        });
    };

    const removeRound = (index) => {
        setFormData({
            ...formData,
            selectionProcess: {
                rounds: formData.selectionProcess.rounds.filter((_, i) => i !== index)
            }
        });
    };

    const addTopicToArray = (arrayName) => {
        if (newTopic.trim()) {
            setFormData({
                ...formData,
                [arrayName]: [...formData[arrayName], newTopic.trim()]
            });
            setNewTopic('');
        }
    };

    const removeFromArray = (arrayName, index) => {
        setFormData({
            ...formData,
            [arrayName]: formData[arrayName].filter((_, i) => i !== index)
        });
    };

    const addLanguage = () => {
        if (newLanguage.trim()) {
            setFormData({
                ...formData,
                codingLanguages: [...formData.codingLanguages, newLanguage.trim()]
            });
            setNewLanguage('');
        }
    };

    const addHRQuestion = () => {
        if (newHRQuestion.trim()) {
            setFormData({
                ...formData,
                hrQuestions: [...formData.hrQuestions, newHRQuestion.trim()]
            });
            setNewHRQuestion('');
        }
    };

    const addSampleQuestion = () => {
        setFormData({
            ...formData,
            sampleQuestions: [...formData.sampleQuestions, { topic: '', question: '', difficulty: 'Medium' }]
        });
    };

    const updateSampleQuestion = (index, field, value) => {
        const updated = [...formData.sampleQuestions];
        updated[index][field] = value;
        setFormData({ ...formData, sampleQuestions: updated });
    };

    const removeSampleQuestion = (index) => {
        setFormData({
            ...formData,
            sampleQuestions: formData.sampleQuestions.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto">
            <div className="mx-auto w-full max-w-5xl my-4 bg-zinc-900 border border-zinc-800 rounded-lg max-h-[92vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-zinc-800 bg-zinc-900">
                    <h2 className="text-2xl font-bold text-white">
                        {company ? 'Edit Company' : 'Add Company'}
                    </h2>
                </div>

                {/* Tabs */}
                <div className="relative z-40 border-b border-zinc-800 px-6 py-2 bg-zinc-900/95 backdrop-blur">
                    <div className="flex flex-wrap items-center gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3 py-2 font-semibold text-sm leading-none rounded-md transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/40'
                                    : 'text-zinc-400 border border-transparent hover:text-zinc-300 hover:bg-zinc-800/60'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto">
                    <div className="p-6 space-y-4">
                        {/* Basic Info Tab */}
                        {activeTab === 'basic' && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                                        Company Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                                        Logo URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.logo}
                                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        placeholder="https://example.com/logo.png"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                                        Industry *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.industry}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        rows="4"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                                        Website
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500/50"
                                    />
                                    <label htmlFor="isActive" className="text-sm font-semibold text-zinc-300">
                                        Active Status
                                    </label>
                                </div>
                            </>
                        )}

                        {/* Eligibility Tab */}
                        {activeTab === 'eligibility' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-zinc-300 mb-2">
                                            Minimum CGPA *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.eligibility.minCGPA}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                eligibility: { ...formData.eligibility, minCGPA: parseFloat(e.target.value) }
                                            })}
                                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-zinc-300 mb-2">
                                            Year of Passing
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.eligibility.yearOfPassing}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                eligibility: { ...formData.eligibility, yearOfPassing: parseInt(e.target.value) }
                                            })}
                                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="backlogAllowed"
                                        checked={formData.eligibility.backlogAllowed}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            eligibility: { ...formData.eligibility, backlogAllowed: e.target.checked }
                                        })}
                                        className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500/50"
                                    />
                                    <label htmlFor="backlogAllowed" className="text-sm font-semibold text-zinc-300">
                                        Backlogs Allowed
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                                        Eligible Branches
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={newBranch}
                                            onChange={(e) => setNewBranch(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBranch())}
                                            placeholder="e.g., CSE"
                                            className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        />
                                        <button
                                            type="button"
                                            onClick={addBranch}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.eligibility.branches.map((branch, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-sm text-white flex items-center gap-2"
                                            >
                                                {branch}
                                                <button
                                                    type="button"
                                                    onClick={() => removeBranch(index)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Roles Tab */}
                        {activeTab === 'roles' && (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-white">Job Roles</h3>
                                    <button
                                        type="button"
                                        onClick={addRole}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-sm"
                                    >
                                        + Add Role
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {formData.roles.map((role, index) => (
                                        <div key={index} className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg space-y-3">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-white font-semibold">Role {index + 1}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => removeRole(index)}
                                                    className="text-red-400 hover:text-red-300 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    value={role.title}
                                                    onChange={(e) => updateRole(index, 'title', e.target.value)}
                                                    placeholder="Role Title"
                                                    className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                />
                                                <input
                                                    type="text"
                                                    value={role.type}
                                                    onChange={(e) => updateRole(index, 'type', e.target.value)}
                                                    placeholder="Type (Full-time/Intern)"
                                                    className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                />
                                            </div>

                                            <input
                                                type="text"
                                                value={role.package}
                                                onChange={(e) => updateRole(index, 'package', e.target.value)}
                                                placeholder="Package (e.g., 4.5 LPA)"
                                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            />

                                            <textarea
                                                value={role.description}
                                                onChange={(e) => updateRole(index, 'description', e.target.value)}
                                                placeholder="Role Description"
                                                rows="2"
                                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            />
                                        </div>
                                    ))}

                                    {formData.roles.length === 0 && (
                                        <p className="text-center text-zinc-500 py-8">No roles added yet. Click "Add Role" to start.</p>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Selection Process Tab */}
                        {activeTab === 'selection' && (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-white">Selection Rounds</h3>
                                    <button
                                        type="button"
                                        onClick={addRound}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-sm"
                                    >
                                        + Add Round
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {formData.selectionProcess.rounds.map((round, index) => (
                                        <div key={index} className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg space-y-3">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-white font-semibold">Round {index + 1}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => removeRound(index)}
                                                    className="text-red-400 hover:text-red-300 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    value={round.name}
                                                    onChange={(e) => updateRound(index, 'name', e.target.value)}
                                                    placeholder="Round Name"
                                                    className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                />
                                                <input
                                                    type="text"
                                                    value={round.duration}
                                                    onChange={(e) => updateRound(index, 'duration', e.target.value)}
                                                    placeholder="Duration (e.g., 90 mins)"
                                                    className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    value={round.cutoff}
                                                    onChange={(e) => updateRound(index, 'cutoff', e.target.value)}
                                                    placeholder="Cutoff (e.g., 60%)"
                                                    className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                />
                                                <select
                                                    value={round.difficulty}
                                                    onChange={(e) => updateRound(index, 'difficulty', e.target.value)}
                                                    className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                >
                                                    <option value="Easy">Easy</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Hard">Hard</option>
                                                </select>
                                            </div>

                                            <textarea
                                                value={round.description}
                                                onChange={(e) => updateRound(index, 'description', e.target.value)}
                                                placeholder="Round Description"
                                                rows="2"
                                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            />
                                        </div>
                                    ))}

                                    {formData.selectionProcess.rounds.length === 0 && (
                                        <p className="text-center text-zinc-500 py-8">No rounds added yet. Click "Add Round" to start.</p>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Topics Tab */}
                        {activeTab === 'topics' && (
                            <div className="space-y-6">
                                {/* Aptitude Topics */}
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                                        Aptitude Topics
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={newTopic}
                                            onChange={(e) => setNewTopic(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopicToArray('aptitudeTopics'))}
                                            placeholder="e.g., Logical Reasoning"
                                            className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => addTopicToArray('aptitudeTopics')}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.aptitudeTopics.map((topic, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-sm text-white flex items-center gap-2"
                                            >
                                                {topic}
                                                <button
                                                    type="button"
                                                    onClick={() => removeFromArray('aptitudeTopics', index)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Technical Topics */}
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                                        Technical Topics
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={newTopic}
                                            onChange={(e) => setNewTopic(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopicToArray('technicalTopics'))}
                                            placeholder="e.g., Data Structures"
                                            className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => addTopicToArray('technicalTopics')}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.technicalTopics.map((topic, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-sm text-white flex items-center gap-2"
                                            >
                                                {topic}
                                                <button
                                                    type="button"
                                                    onClick={() => removeFromArray('technicalTopics', index)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Coding Languages */}
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                                        Coding Languages
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={newLanguage}
                                            onChange={(e) => setNewLanguage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                                            placeholder="e.g., Python"
                                            className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        />
                                        <button
                                            type="button"
                                            onClick={addLanguage}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.codingLanguages.map((lang, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white flex items-center gap-2"
                                            >
                                                {lang}
                                                <button
                                                    type="button"
                                                    onClick={() => removeFromArray('codingLanguages', index)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Questions Tab */}
                        {activeTab === 'questions' && (
                            <div className="space-y-6">
                                <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
                                    <p className="text-sm text-blue-200">
                                        Coding Questions added below are used in both:
                                        <span className="font-semibold"> Prep Hub </span>
                                        and
                                        <span className="font-semibold"> Company Details - Resources tab</span>.
                                    </p>
                                </div>

                                {/* HR Questions */}
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                                        HR Questions
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={newHRQuestion}
                                            onChange={(e) => setNewHRQuestion(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHRQuestion())}
                                            placeholder="e.g., Tell me about yourself"
                                            className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        />
                                        <button
                                            type="button"
                                            onClick={addHRQuestion}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {formData.hrQuestions.map((question, index) => (
                                            <div
                                                key={index}
                                                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white flex justify-between items-center"
                                            >
                                                <span>{question}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFromArray('hrQuestions', index)}
                                                    className="text-red-400 hover:text-red-300 ml-2"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Coding Questions */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="block text-sm font-semibold text-zinc-300">
                                            Coding Questions (Prep Hub + Company Resources)
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addSampleQuestion}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-sm"
                                        >
                                            + Add Question
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {formData.sampleQuestions.map((sq, index) => (
                                            <div key={index} className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-white text-sm font-semibold">Question {index + 1}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSampleQuestion(index)}
                                                        className="text-red-400 hover:text-red-300 text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>

                                                <input
                                                    type="text"
                                                    value={sq.topic}
                                                    onChange={(e) => updateSampleQuestion(index, 'topic', e.target.value)}
                                                    placeholder="Topic (e.g., Arrays)"
                                                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                />

                                                <textarea
                                                    value={sq.question}
                                                    onChange={(e) => updateSampleQuestion(index, 'question', e.target.value)}
                                                    placeholder="Question"
                                                    rows="2"
                                                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                />

                                                <select
                                                    value={sq.difficulty}
                                                    onChange={(e) => updateSampleQuestion(index, 'difficulty', e.target.value)}
                                                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                >
                                                    <option value="Easy">Easy</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Hard">Hard</option>
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Statistics Tab */}
                        {activeTab === 'statistics' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-zinc-300 mb-2">
                                            Average Package
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.averagePackage}
                                            onChange={(e) => setFormData({ ...formData, averagePackage: e.target.value })}
                                            placeholder="e.g., 4.5 LPA"
                                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-zinc-300 mb-2">
                                            Students Placed
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.studentPlaced}
                                            onChange={(e) => setFormData({ ...formData, studentPlaced: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                                        Interview Timeline
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.interviewTimeline}
                                        onChange={(e) => setFormData({ ...formData, interviewTimeline: e.target.value })}
                                        placeholder="e.g., September - October"
                                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="previouslyVisited"
                                        checked={formData.previouslyVisited}
                                        onChange={(e) => setFormData({ ...formData, previouslyVisited: e.target.checked })}
                                        className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500/50"
                                    />
                                    <label htmlFor="previouslyVisited" className="text-sm font-semibold text-zinc-300">
                                        Previously Visited Campus
                                    </label>
                                </div>

                                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                    <h4 className="text-blue-400 font-semibold mb-2">Placement Statistics Preview</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-zinc-400">Students Placed:</span>
                                            <span className="text-white font-semibold ml-2">{formData.studentPlaced}</span>
                                        </div>
                                        <div>
                                            <span className="text-zinc-400">Average Package:</span>
                                            <span className="text-white font-semibold ml-2">{formData.averagePackage || 'Not set'}</span>
                                        </div>
                                        <div>
                                            <span className="text-zinc-400">Timeline:</span>
                                            <span className="text-white font-semibold ml-2">{formData.interviewTimeline || 'Not set'}</span>
                                        </div>
                                        <div>
                                            <span className="text-zinc-400">Previously Visited:</span>
                                            <span className="text-white font-semibold ml-2">{formData.previouslyVisited ? 'Yes' : 'No'}</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="p-6 border-t border-zinc-800 flex items-center justify-end gap-3 bg-zinc-900 sticky bottom-0 z-20">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            {company ? 'Update' : 'Create'} Company
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
