import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { BookOpen, Clock, ArrowLeft } from 'lucide-react';

export default function MockTestsPage() {
  const [tests, setTests] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    fetchTests();
    fetchAttempts();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await apiClient.get('/mock-tests');
      setTests(response.data.tests || []);
    } catch (error) {
      console.error('Failed to fetch tests:', error);
    }
  };

  const fetchAttempts = async () => {
    try {
      const response = await apiClient.get('/mock-tests/my-attempts');
      setAttempts(response.data.attempts || []);
    } catch (error) {
      console.error('Failed to fetch attempts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-zinc-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold">Mock Tests</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'available'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Available Tests
          </button>
          <button
            onClick={() => setActiveTab('attempts')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'attempts'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            My Attempts ({attempts.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'available' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div
                key={test._id}
                className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600/20 text-blue-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{test.title}</h3>
                    <p className="text-sm text-zinc-400">{test.category}</p>
                  </div>
                </div>

                {test.description && (
                  <p className="text-sm text-zinc-400 mb-4">{test.description}</p>
                )}

                <div className="flex items-center justify-between text-sm text-zinc-400 mb-4">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {test.duration} mins
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    test.difficulty === 'Easy'
                      ? 'bg-emerald-600/20 text-emerald-400'
                      : test.difficulty === 'Hard'
                      ? 'bg-red-600/20 text-red-400'
                      : 'bg-amber-600/20 text-amber-400'
                  }`}>
                    {test.difficulty}
                  </span>
                </div>

                <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  Start Test
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt, idx) => (
              <div
                key={idx}
                className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold mb-1">{attempt.test.title}</h3>
                  <p className="text-sm text-zinc-400">{attempt.test.category}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-500">
                    {attempt.score}
                  </div>
                  <div className="text-sm text-zinc-400">Score</div>
                </div>
              </div>
            ))}
            {attempts.length === 0 && (
              <div className="text-center py-12 text-zinc-400">
                No test attempts yet
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
