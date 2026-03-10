import React, { useEffect, useMemo, useState } from 'react';
import apiClient from '../utils/apiClient';
import { BookOpen, Clock, CheckCircle2, X } from 'lucide-react';

export default function MockTestsPage() {
  const [tests, setTests] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');

  const [activeTest, setActiveTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [startingAt, setStartingAt] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [testsRes, attemptsRes] = await Promise.all([
        apiClient.get('/mock-tests'),
        apiClient.get('/mock-tests/my-attempts')
      ]);
      setTests(testsRes.data.tests || []);
      setAttempts(attemptsRes.data.attempts || []);
    } catch (error) {
      console.error('Failed to load mock test data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startTest = async (testId) => {
    try {
      const response = await apiClient.get(`/mock-tests/${testId}`);
      setActiveTest(response.data.test);
      setAnswers({});
      setStartingAt(Date.now());
    } catch (error) {
      console.error('Failed to load test:', error);
      alert('Could not open test right now.');
    }
  };

  const answeredCount = useMemo(
    () => Object.values(answers).filter(Boolean).length,
    [answers]
  );

  const submitTest = async () => {
    if (!activeTest) return;
    const totalQuestions = activeTest.questions.length;
    const answerArray = Array.from({ length: totalQuestions }, (_, i) => answers[i] || '');

    setSubmitting(true);
    try {
      const elapsedMs = Date.now() - (startingAt || Date.now());
      const timeTaken = Math.max(1, Math.round(elapsedMs / 60000));

      const response = await apiClient.post(`/mock-tests/${activeTest._id}/submit`, {
        answers: answerArray,
        timeTaken
      });

      const result = response.data?.result;
      alert(`Submitted! Score: ${result.score}/${result.totalQuestions} (${result.percentage}%)`);

      setActiveTest(null);
      setAnswers({});
      setStartingAt(null);
      fetchData();
      setActiveTab('attempts');
    } catch (error) {
      console.error('Failed to submit test:', error);
      alert('Failed to submit test. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Mock Tests</h1>
        <p className="text-zinc-400 mt-1">Take timed company mock tests and track your progress.</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'available'
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
        >
          Available Tests
        </button>
        <button
          onClick={() => setActiveTab('attempts')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'attempts'
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
                  <h3 className="font-semibold text-white">{test.title}</h3>
                  <p className="text-sm text-zinc-400">{test.category} {test.company ? `| ${test.company}` : ''}</p>
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
                <span className={`px-2 py-1 rounded text-xs ${test.difficulty === 'Easy'
                    ? 'bg-emerald-600/20 text-emerald-400'
                    : test.difficulty === 'Hard'
                      ? 'bg-red-600/20 text-red-400'
                      : 'bg-amber-600/20 text-amber-400'
                  }`}>
                  {test.difficulty}
                </span>
              </div>

              <button
                onClick={() => startTest(test._id)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Start Test
              </button>
            </div>
          ))}
          {tests.length === 0 && (
            <div className="col-span-full text-center py-12 text-zinc-400">
              No tests available yet
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {attempts.map((attempt, idx) => (
            <div
              key={idx}
              className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-white mb-1">{attempt.test.title}</h3>
                <p className="text-sm text-zinc-400">{attempt.test.category}</p>
                <p className="text-xs text-zinc-500 mt-1">{new Date(attempt.attemptedAt).toLocaleString()}</p>
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

      {activeTest && (
        <div className="fixed inset-0 z-50 bg-black/80 p-4 flex items-center justify-center">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900">
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900">
              <div>
                <h2 className="text-xl font-bold text-white">{activeTest.title}</h2>
                <p className="text-sm text-zinc-400">
                  {activeTest.category} | {activeTest.difficulty} | {activeTest.duration} mins
                </p>
              </div>
              <button
                onClick={() => setActiveTest(null)}
                className="p-2 rounded-lg hover:bg-zinc-800"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-zinc-400">
                Answered {answeredCount}/{activeTest.questions.length}
              </p>

              {activeTest.questions.map((q, qIndex) => (
                <div key={qIndex} className="border border-zinc-800 rounded-lg p-4 bg-zinc-950/40">
                  <p className="text-white font-medium mb-3">Q{qIndex + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((option, optIndex) => (
                      <label key={optIndex} className="flex items-start gap-2 text-zinc-300 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name={`q-${qIndex}`}
                          value={option}
                          checked={answers[qIndex] === option}
                          onChange={(e) => setAnswers((prev) => ({ ...prev, [qIndex]: e.target.value }))}
                          className="mt-0.5"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 p-4 border-t border-zinc-800 bg-zinc-900 flex items-center justify-between">
              <div className="text-sm text-zinc-400">Unanswered: {activeTest.questions.length - answeredCount}</div>
              <button
                onClick={submitTest}
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold inline-flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Submit Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
