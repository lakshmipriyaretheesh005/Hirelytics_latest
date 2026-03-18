import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import apiClient from '../utils/apiClient';
import { toast } from 'sonner';

export default function AdminCompanyRequestsPage() {
    const [pendingCompanies, setPendingCompanies] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [reviewingContributionId, setReviewingContributionId] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            const pendingRes = await apiClient.get('/companies/contributions/pending');
            setPendingCompanies(pendingRes.data.companies || []);
            setPendingCount(pendingRes.data.count || 0);
        } catch (error) {
            toast.error('Failed to fetch pending requests');
        } finally {
            setLoading(false);
        }
    };

    const handleContributionReview = async (companyId, contributionId, status) => {
        try {
            setReviewingContributionId(contributionId);
            await apiClient.patch(`/companies/${companyId}/contributions/${contributionId}/verify`, { status });
            toast.success(`Contribution ${status}`);
            fetchPendingRequests();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update contribution');
        } finally {
            setReviewingContributionId('');
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setAppliedSearch(searchInput.trim().toLowerCase());
    };

    const filteredCompanies = useMemo(() => {
        return [...pendingCompanies]
            .filter((company) => {
                if (!appliedSearch) {
                    return true;
                }

                const searchableText = [company.name, company.industry]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();

                return searchableText.includes(appliedSearch);
            })
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }, [pendingCompanies, appliedSearch]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">Company Question Requests</h1>
                    <p className="text-zinc-400">Review student-submitted placement questions grouped by company</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {pendingCount} Pending
                </span>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search companies and press Enter"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
                >
                    Search
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setSearchInput('');
                        setAppliedSearch('');
                    }}
                    className="px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold transition-colors"
                >
                    Clear
                </button>
            </form>

            {appliedSearch && (
                <p className="text-sm text-zinc-400">
                    Showing {filteredCompanies.length} result(s) for "{appliedSearch}"
                </p>
            )}

            {loading ? (
                <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-8 text-center text-zinc-500">
                    Loading pending submissions...
                </div>
            ) : filteredCompanies.length === 0 ? (
                <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-8 text-center text-zinc-500">
                    {appliedSearch
                        ? `No pending requests found for "${appliedSearch}".`
                        : 'No pending student submissions.'}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredCompanies.map((company) => (
                        <div key={company._id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-white font-semibold">{company.name}</p>
                                    <p className="text-xs text-zinc-500">{company.industry || 'Industry not set'}</p>
                                </div>
                                <span className="text-xs text-zinc-400">{company.contributions?.length || 0} pending</span>
                            </div>

                            <div className="space-y-3">
                                {(company.contributions || []).map((contribution) => (
                                    <div key={contribution._id} className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                                        <div className="flex items-center justify-between gap-3 mb-2">
                                            <div className="flex flex-wrap gap-2 text-xs">
                                                <span className="px-2 py-1 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
                                                    {contribution.type || 'question'}
                                                </span>
                                                {contribution.difficulty && (
                                                    <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                                                        {contribution.difficulty}
                                                    </span>
                                                )}
                                                {contribution.topic && (
                                                    <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                                                        {contribution.topic}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-zinc-400 text-right">
                                                <p>{contribution.submittedBy?.fullName || 'Student'}</p>
                                                <p>{contribution.submittedBy?.email || ''}</p>
                                            </div>
                                        </div>

                                        <p className="text-sm text-zinc-200 mb-3">{contribution.question}</p>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleContributionReview(company._id, contribution._id, 'approved')}
                                                disabled={reviewingContributionId === contribution._id}
                                                className="px-3 py-1.5 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleContributionReview(company._id, contribution._id, 'rejected')}
                                                disabled={reviewingContributionId === contribution._id}
                                                className="px-3 py-1.5 text-xs font-semibold rounded bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
