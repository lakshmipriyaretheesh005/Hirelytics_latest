import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Code, Download, X } from 'lucide-react';
import apiClient from '../utils/apiClient';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export default function PrepHubPage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [returnOnClose, setReturnOnClose] = useState(false);
    const [returnToPath, setReturnToPath] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const questionSectionId = 'company-coding-questions';

    useEffect(() => {
        fetchCompanies();

        const refreshOnFocus = () => fetchCompanies();
        const refreshInterval = setInterval(fetchCompanies, 30000);

        window.addEventListener('focus', refreshOnFocus);

        return () => {
            clearInterval(refreshInterval);
            window.removeEventListener('focus', refreshOnFocus);
        };
    }, []);

    const getCompanyPracticeQuestions = (company) => {
        const adminQuestions = (company.sampleQuestions || []).map((item) => ({
            topic: item.topic || 'Coding',
            question: item.question,
            difficulty: item.difficulty || 'Medium',
            source: 'admin'
        }));

        const codingContributionTypes = new Set(['coding']);
        const contributionQuestions = (company.studentContributions || [])
            .filter((item) => (item.status === 'approved' || !item.status) && codingContributionTypes.has(item.type))
            .map((item) => ({
                topic: item.topic || item.type || 'Community',
                question: item.question,
                difficulty: item.difficulty || 'Medium',
                source: 'student'
            }));

        return [...adminQuestions, ...contributionQuestions];
    };

    const fetchCompanies = async () => {
        try {
            const response = await apiClient.get('/companies');
            setCompanies(response.data.companies || []);
        } catch (error) {
            console.error('Failed to fetch companies:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loading) {
            return;
        }

        const requestedCompany = (searchParams.get('company') || '').trim().toLowerCase();

        if (!requestedCompany) {
            return;
        }

        const matchedCompany = companies.find(
            (company) => company.name?.toLowerCase() === requestedCompany
        );

        if (matchedCompany) {
            setSelectedCompany({
                ...matchedCompany,
                _practiceQuestions: getCompanyPracticeQuestions(matchedCompany)
            });
            setReturnToPath(location.state?.returnTo || '');
            setReturnOnClose(Boolean(location.state?.returnTo));

            const section = document.getElementById(questionSectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('company');
        setSearchParams(nextParams, { replace: true });
    }, [loading, companies, searchParams, setSearchParams, location.state]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const companiesWithQuestions = companies.filter(
        (company) => getCompanyPracticeQuestions(company).length > 0
    );

    const handleCardClick = (company) => {
        setSelectedCompany({
            ...company,
            _practiceQuestions: getCompanyPracticeQuestions(company)
        });
        setReturnOnClose(false);
        setReturnToPath('');
    };

    const handleCloseModal = () => {
        if (returnOnClose && returnToPath) {
            navigate(returnToPath, { replace: true });
            return;
        }

        setSelectedCompany(null);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Prep Hub</h1>
                <p className="text-zinc-400">Company-specific preparation resources and coding questions</p>
            </div>

            {/* Resource Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6 group">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                        <FileText className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white font-bold">Interview Guides</h3>
                        <span className="text-[10px] px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">Coming Soon</span>
                    </div>
                    <p className="text-sm text-zinc-400">HR prep guides will be added soon</p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        const section = document.getElementById(questionSectionId);
                        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="text-left border border-zinc-800 bg-zinc-900/50 rounded-xl p-6 hover:bg-zinc-900 transition-colors cursor-pointer group"
                >
                    <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                        <Code className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white font-bold">Coding Practice</h3>
                        <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300">Active</span>
                    </div>
                    <p className="text-sm text-zinc-400">Problem sets & solutions</p>
                </button>

                <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6 group">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                        <Download className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white font-bold">Study Materials</h3>
                        <span className="text-[10px] px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">Coming Soon</span>
                    </div>
                    <p className="text-sm text-zinc-400">PDFs & curated docs will be added soon</p>
                </div>
            </div>

            {/* Company-wise Coding Questions */}
            <div id={questionSectionId}>
                <h2 className="text-xl font-bold text-white mb-4">Company-wise Coding Questions</h2>
                {companiesWithQuestions.length === 0 ? (
                    <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-12 text-center">
                        <BookOpen className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-400">No coding questions available yet</p>
                        <p className="text-sm text-zinc-500 mt-2">
                            Admin can add questions from Admin Panel, then open Companies, Edit, and Questions tab.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {companiesWithQuestions.map((company) => {
                            const questions = getCompanyPracticeQuestions(company);
                            const easyCount = questions.filter((q) => q.difficulty === 'Easy').length;
                            const mediumCount = questions.filter((q) => q.difficulty === 'Medium').length;
                            const hardCount = questions.filter((q) => q.difficulty === 'Hard').length;

                            return (
                                <div
                                    key={company._id}
                                    className="border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-900/60 rounded-xl p-6 hover:border-blue-500/40 transition-all cursor-pointer"
                                    onClick={() => handleCardClick(company)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleCardClick(company);
                                        }
                                    }}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-white text-2xl font-black leading-tight">{company.name}</h3>
                                            <p className="text-sm text-zinc-400 mt-1">{company.industry || 'Technology'}</p>
                                        </div>
                                        <div className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400">
                                            {questions.length} Questions
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                                        <div className="px-2 py-1 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold text-center">
                                            Easy: {easyCount}
                                        </div>
                                        <div className="px-2 py-1 rounded border border-amber-500/30 bg-amber-500/10 text-amber-400 font-semibold text-center">
                                            Medium: {mediumCount}
                                        </div>
                                        <div className="px-2 py-1 rounded border border-red-500/30 bg-red-500/10 text-red-400 font-semibold text-center">
                                            Hard: {hardCount}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {questions.slice(0, 3).map((sq, idx) => (
                                            <div key={`${company._id}-${idx}`} className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/50">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-semibold text-blue-400">{sq.topic || 'Coding'}</span>
                                                    <span className="text-[10px] px-2 py-1 rounded bg-zinc-800 text-zinc-300">{sq.difficulty || 'Medium'}</span>
                                                </div>
                                                <p className="text-sm text-zinc-200 line-clamp-2">{sq.question}</p>
                                                {sq.source === 'student' && (
                                                    <p className="mt-1 text-[10px] uppercase tracking-wide text-emerald-400">Verified Student</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {questions.length > 3 && (
                                        <p className="text-xs text-zinc-500 mt-3">+ {questions.length - 3} more questions in this company set</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Questions Modal */}
            {selectedCompany && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 p-2 md:p-3 overflow-y-auto">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[96vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white">{selectedCompany.name}</h2>
                                <p className="text-sm text-zinc-400 mt-1">Coding Questions - {selectedCompany._practiceQuestions.length} total</p>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-zinc-400" />
                            </button>
                        </div>

                        {/* Modal Body - Questions by Difficulty */}
                        <div className="px-6 pt-4 pb-6 space-y-6">
                            {['Easy', 'Medium', 'Hard'].map((difficulty) => {
                                const difficultyQuestions = selectedCompany._practiceQuestions.filter(
                                    (q) => q.difficulty === difficulty
                                );

                                if (difficultyQuestions.length === 0) return null;

                                const colors = {
                                    Easy: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', badge: 'bg-emerald-500/20' },
                                    Medium: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400', badge: 'bg-amber-500/20' },
                                    Hard: { border: 'border-red-500/30', bg: 'bg-red-500/10', text: 'text-red-400', badge: 'bg-red-500/20' }
                                };

                                const color = colors[difficulty];

                                return (
                                    <div key={difficulty}>
                                        <div className={`px-3 py-1.5 rounded-lg inline-block mb-4 border ${color.border} ${color.bg}`}>
                                            <h3 className={`text-sm font-bold ${color.text}`}>
                                                {difficulty} ({difficultyQuestions.length})
                                            </h3>
                                        </div>

                                        <div className="space-y-3">
                                            {difficultyQuestions.map((question, idx) => (
                                                <div
                                                    key={`${difficulty}-${idx}`}
                                                    className={`p-4 rounded-lg border ${color.border} bg-zinc-950/50 hover:bg-zinc-900 transition-colors`}
                                                >
                                                    <div className="flex items-start justify-between gap-3 mb-2">
                                                        <span className={`text-xs font-semibold px-2 py-1 rounded ${color.bg} ${color.text}`}>
                                                            {question.topic || 'Problem'}
                                                        </span>
                                                        <span className={`text-xs px-2 py-1 rounded ${color.badge} ${color.text} whitespace-nowrap`}>
                                                            {difficulty}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-zinc-200 leading-relaxed">
                                                        {question.question}
                                                    </p>
                                                    {question.source === 'student' && (
                                                        <p className="mt-2 text-[10px] uppercase tracking-wide text-emerald-400">Verified Student Contribution</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 p-4 flex gap-3">
                            <button
                                onClick={handleCloseModal}
                                className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
                            >
                                {returnOnClose ? 'Back to Company' : 'Back to Prep Hub'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
