import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Video, Code, ExternalLink, Download } from 'lucide-react';
import apiClient from '../utils/apiClient';

export default function PrepHubPage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompanies();
    }, []);

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Prep Hub</h1>
                <p className="text-zinc-400">Company-specific preparation resources and materials</p>
            </div>

            {/* Resource Categories */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6 hover:bg-zinc-900 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                        <FileText className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="text-white font-bold mb-1">Interview Guides</h3>
                    <p className="text-sm text-zinc-400">Past interview questions</p>
                </div>

                <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6 hover:bg-zinc-900 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                        <Video className="w-6 h-6 text-purple-500" />
                    </div>
                    <h3 className="text-white font-bold mb-1">Video Tutorials</h3>
                    <p className="text-sm text-zinc-400">Learn from experts</p>
                </div>

                <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6 hover:bg-zinc-900 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                        <Code className="w-6 h-6 text-amber-500" />
                    </div>
                    <h3 className="text-white font-bold mb-1">Coding Practice</h3>
                    <p className="text-sm text-zinc-400">Problem sets & solutions</p>
                </div>

                <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6 hover:bg-zinc-900 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                        <Download className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h3 className="text-white font-bold mb-1">Study Materials</h3>
                    <p className="text-sm text-zinc-400">PDFs & documents</p>
                </div>
            </div>

            {/* Company-wise Resources */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4">Company Resources</h2>
                {companies.length === 0 ? (
                    <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-12 text-center">
                        <BookOpen className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-400">No resources available yet</p>
                        <p className="text-sm text-zinc-500 mt-2">Resources will be added as companies are registered</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {companies.slice(0, 6).map((company) => (
                            <div key={company._id} className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6 hover:bg-zinc-900 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                                        <span className="text-xl font-bold text-zinc-400">{company.name[0]}</span>
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                                        {company.industry || 'Tech'}
                                    </span>
                                </div>
                                <h3 className="text-white font-bold mb-2">{company.name}</h3>
                                <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                                    {company.description || 'Placement preparation resources for ' + company.name}
                                </p>
                                <div className="space-y-2">
                                    <button className="w-full flex items-center justify-between px-3 py-2 bg-zinc-950/50 border border-zinc-800 rounded-lg text-sm text-zinc-300 hover:bg-zinc-950 hover:border-zinc-700 transition-colors">
                                        <span>Interview Questions</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                    <button className="w-full flex items-center justify-between px-3 py-2 bg-zinc-950/50 border border-zinc-800 rounded-lg text-sm text-zinc-300 hover:bg-zinc-950 hover:border-zinc-700 transition-colors">
                                        <span>Selection Process</span>
                                        <FileText className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Popular Resources */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4">Popular Resources</h2>
                <div className="space-y-3">
                    <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-4 flex items-center justify-between hover:bg-zinc-900 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <h4 className="text-white font-medium">Common Interview Questions - All Companies</h4>
                                <p className="text-sm text-zinc-400">Updated 2 days ago</p>
                            </div>
                        </div>
                        <ExternalLink className="w-5 h-5 text-zinc-500" />
                    </div>

                    <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-4 flex items-center justify-between hover:bg-zinc-900 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                                <Code className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <h4 className="text-white font-medium">Top 100 Coding Problems for Placements</h4>
                                <p className="text-sm text-zinc-400">Updated 1 week ago</p>
                            </div>
                        </div>
                        <ExternalLink className="w-5 h-5 text-zinc-500" />
                    </div>

                    <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-4 flex items-center justify-between hover:bg-zinc-900 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                                <Video className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <h4 className="text-white font-medium">HR Interview Preparation Guide</h4>
                                <p className="text-sm text-zinc-400">Updated 3 days ago</p>
                            </div>
                        </div>
                        <ExternalLink className="w-5 h-5 text-zinc-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}
