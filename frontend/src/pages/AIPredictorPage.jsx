import React from 'react';
import { BrainCircuit, TrendingUp, Award, Target } from 'lucide-react';

export default function AIPredictorPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">AI Placement Predictor</h1>
                <p className="text-zinc-400">AI-driven probability score based on your performance and profile</p>
            </div>

            {/* Coming Soon Card */}
            <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-12 text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center border border-blue-500/20">
                        <BrainCircuit className="w-10 h-10 text-blue-500" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">AI Predictor Coming Soon</h2>
                <p className="text-zinc-400 max-w-md mx-auto mb-8">
                    Our AI model is being trained to provide accurate placement predictions based on your academic performance,
                    mock test scores, and skill assessments.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-6">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Target className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="text-white font-bold mb-2">Success Rate</h3>
                        <p className="text-sm text-zinc-400">Predict your chances with top companies</p>
                    </div>
                    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-6">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-white font-bold mb-2">Skill Analysis</h3>
                        <p className="text-sm text-zinc-400">Get insights on areas to improve</p>
                    </div>
                    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-6">
                        <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Award className="w-6 h-6 text-amber-500" />
                        </div>
                        <h3 className="text-white font-bold mb-2">Personalized Tips</h3>
                        <p className="text-sm text-zinc-400">AI-powered recommendations for success</p>
                    </div>
                </div>
            </div>

            {/* Placeholder Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Your Current Stats</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-400">Mock Tests Completed</span>
                            <span className="text-white font-bold">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-400">Average Score</span>
                            <span className="text-white font-bold">-</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-400">Skills Added</span>
                            <span className="text-white font-bold">0</span>
                        </div>
                    </div>
                </div>

                <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">What We'll Analyze</h3>
                    <ul className="space-y-3 text-sm text-zinc-400">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Academic performance (CGPA, semester scores)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Mock test scores and consistency</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Technical skills and certifications</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Past placement trends in your branch</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
