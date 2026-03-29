import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, BookOpen, Code, Brain } from 'lucide-react';
import apiClient from '../utils/apiClient';

export default function CompanyDetailPage() {
    const { companyName } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [company, setCompany] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await apiClient.get('/companies');
                const companies = response.data.companies || [];
                const normalizedName = decodeURIComponent(companyName || '').toLowerCase();
                const foundCompany = companies.find(
                    (c) => c.name?.toLowerCase() === normalizedName
                );

                if (!foundCompany) {
                    setLoadError('Company not found');
                    return;
                }

                setCompany(foundCompany);
            } catch (error) {
                console.error('Failed to fetch company details:', error);
                setLoadError('Unable to load company details right now.');
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [companyName]);

    useEffect(() => {
        const requestedTab = searchParams.get('tab');
        const validTabs = ['overview', 'eligibility', 'selection', 'preparation', 'resources'];
        if (requestedTab && validTabs.includes(requestedTab)) {
            setActiveTab(requestedTab);
        }
    }, [searchParams]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (loadError || !company) {
        return (
            <div className="space-y-4">
                <button
                    onClick={() => navigate('/companies')}
                    className="inline-flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Companies
                </button>
                <div className="border border-red-500/30 bg-red-500/10 rounded-xl p-6 text-red-300">
                    {loadError || 'Company not found'}
                </div>
            </div>
        );
    }

    const roles = company.roles || [];
    const selectionRounds = company.selectionProcess?.rounds || [];
    const sampleQuestions = company.sampleQuestions || [];
    const hrQuestions = company.hrQuestions || [];
    const codingQuestionCount = sampleQuestions.length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-8">
                <button
                    onClick={() => navigate('/companies')}
                    className="text-zinc-400 hover:text-white transition-colors mt-1"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-3xl font-bold text-white">
                            {company.logo}
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">{company.name}</h1>
                            <p className="text-zinc-400 mt-1">{company.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-4">
                    <p className="text-zinc-400 text-sm mb-1">Average Package</p>
                    <p className="text-2xl font-bold text-blue-500">{company.averagePackage || roles[0]?.package || 'N/A'}</p>
                </div>
                <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-4">
                    <p className="text-zinc-400 text-sm mb-1">Min CGPA</p>
                    <p className="text-2xl font-bold text-white">{company.eligibility?.minCGPA ?? 'N/A'}</p>
                </div>
                <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-4">
                    <p className="text-zinc-400 text-sm mb-1">Eligible Branches</p>
                    <p className="text-lg font-bold text-white">{(company.eligibility?.branches || []).length}</p>
                </div>
                <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-4">
                    <p className="text-zinc-400 text-sm mb-1">Interview Rounds</p>
                    <p className="text-2xl font-bold text-white">{selectionRounds.length}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-zinc-800">
                <div className="flex gap-8">
                    {['overview', 'eligibility', 'selection', 'preparation', 'resources'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-3 font-medium transition-colors capitalize ${activeTab === tab
                                    ? 'text-blue-500 border-b-2 border-blue-500'
                                    : 'text-zinc-400 hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">About {company.name}</h3>
                            <p className="text-zinc-400 leading-relaxed mb-4">{company.description}</p>
                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400">
                                Visit Website <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6">
                                <h4 className="text-lg font-bold text-white mb-4">Available Roles</h4>
                                <div className="space-y-4">
                                    {roles.map((role, idx) => (
                                        <div key={idx} className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
                                            <h5 className="text-white font-semibold">{role.title}</h5>
                                            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                                <div>
                                                    <p className="text-zinc-500">Type</p>
                                                    <p className="text-white">{role.type}</p>
                                                </div>
                                                <div>
                                                    <p className="text-zinc-500">Package</p>
                                                    <p className="text-blue-500 font-bold">{role.package}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6">
                                <h4 className="text-lg font-bold text-white mb-4">Interview Timeline</h4>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-zinc-500 mb-1">Expected Timeline</p>
                                        <p className="text-white">{company.interviewTimeline}</p>
                                    </div>
                                    <div>
                                        <p className="text-zinc-500 mb-1">Type</p>
                                        <p className="text-white">On-Campus / Off-Campus</p>
                                    </div>
                                    <div>
                                        <p className="text-zinc-500 mb-1">Previously Visited</p>
                                        <p className="text-green-400 font-semibold">
                                            {company.previouslyVisited ? 'Yes ✓' : 'No'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-zinc-500 mb-1">Students Placed Last Year</p>
                                        <p className="text-white">{company.studentPlaced || 'Multiple'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border border-amber-500/30 bg-amber-500/10 rounded-xl p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h4 className="text-lg font-bold text-amber-200 mb-1">Coding Questions</h4>
                                    <p className="text-sm text-amber-100/80">
                                        Same questions are used in Prep Hub and this company page.
                                    </p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-300/20 text-amber-100 border border-amber-300/30">
                                    {codingQuestionCount} Available
                                </span>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('resources')}
                                    className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 text-sm font-semibold transition-colors"
                                >
                                    View Here
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/prep-hub')}
                                    className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-semibold transition-colors"
                                >
                                    Open Prep Hub
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Eligibility Tab */}
                {activeTab === 'eligibility' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6">
                                <h4 className="text-lg font-bold text-white mb-4">Basic Requirements</h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-zinc-500 text-sm">Minimum CGPA</p>
                                        <p className="text-xl font-bold text-white">{company.eligibility?.minCGPA ?? 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-zinc-500 text-sm">Eligible Branches</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {(company.eligibility?.branches || []).map(branch => (
                                                <span key={branch} className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
                                                    {branch}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-zinc-500 text-sm">Backlogs Allowed</p>
                                        <p className={`font-semibold ${company.eligibility?.backlogAllowed ? 'text-green-400' : 'text-red-400'}`}>
                                            {company.eligibility?.backlogAllowed ? 'Yes' : 'No'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6">
                                <h4 className="text-lg font-bold text-white mb-4">Important Notes</h4>
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <p className="text-zinc-500 mb-1">Eligibility</p>
                                        <p className="text-zinc-300">{company.eligibilityNote || 'Check the eligibility criteria listed on this page.'}</p>
                                    </div>
                                    <div>
                                        <p className="text-zinc-500 mb-1">Experience</p>
                                        <p className="text-zinc-300">{company.experienceNote || 'Previous process and expectations may vary each year.'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Selection Process Tab */}
                {activeTab === 'selection' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Selection Process</h3>
                        {selectionRounds.map((round, idx) => (
                            <div key={idx} className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                        <span className="text-blue-500 font-bold text-lg">{idx + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-white mb-2">{round.name}</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                            <div>
                                                <p className="text-zinc-500 text-sm">Duration</p>
                                                <p className="text-white font-semibold">{round.duration}</p>
                                            </div>
                                            <div>
                                                <p className="text-zinc-500 text-sm">Difficulty</p>
                                                <p className="text-white font-semibold">{round.difficulty || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-zinc-500 text-sm">Cutoff</p>
                                                <p className="text-white font-semibold">{round.cutoff || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-zinc-500 text-sm">Topics Covered</p>
                                                <p className="text-white font-semibold">{(round.sections || round.topics)?.length || 0}</p>
                                            </div>
                                        </div>
                                        <p className="text-zinc-400 text-sm mb-3">{round.description}</p>
                                        {(round.sections || round.topics) && (
                                            <div>
                                                <p className="text-zinc-500 text-sm font-semibold mb-2">Topics/Sections:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {(round.sections || round.topics).map((topic, i) => (
                                                        <span key={i} className="px-2 py-1 bg-zinc-950 border border-zinc-700 text-zinc-300 rounded text-xs">
                                                            {topic}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Preparation Tab */}
                {activeTab === 'preparation' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Brain className="w-5 h-5 text-blue-500" />
                                    <h4 className="text-lg font-bold text-white">Aptitude Topics</h4>
                                </div>
                                <div className="space-y-2">
                                    {(company.aptitudeTopics || []).map((topic, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-zinc-300">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                            {topic}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Code className="w-5 h-5 text-purple-500" />
                                    <h4 className="text-lg font-bold text-white">Technical Topics</h4>
                                </div>
                                <div className="space-y-2">
                                    {(company.technicalTopics || []).slice(0, 10).map((topic, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-zinc-300">
                                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                            {topic}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6">
                            <h4 className="text-lg font-bold text-white mb-4">Preferred Languages</h4>
                            <div className="flex flex-wrap gap-3">
                                {(company.codingLanguages || []).map(lang => (
                                    <span key={lang} className="px-4 py-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Resources Tab */}
                {activeTab === 'resources' && (
                    <div className="space-y-6">
                        <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="w-5 h-5 text-emerald-500" />
                                <h4 className="text-lg font-bold text-white">Coding Practice</h4>
                            </div>
                            <p className="text-sm text-zinc-400 mb-4">
                                Coding questions are managed in one place to avoid duplicates.
                                Open Prep Hub to practice the full company-wise question set.
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                                    {sampleQuestions.length} Questions
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                                    Synced from Admin Company Edit
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate('/prep-hub')}
                                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
                            >
                                Open Coding Questions in Prep Hub
                            </button>
                        </div>

                        <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6">
                            <h4 className="text-lg font-bold text-white mb-4">HR Questions</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {hrQuestions.map((q, idx) => (
                                    <div key={idx} className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-3">
                                        <p className="text-zinc-300 text-sm">{q}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
