import React, { useEffect, useMemo, useState } from 'react';
import apiClient from '../utils/apiClient';
import { Plus, BarChart3, ClipboardList } from 'lucide-react';

const emptyQuestion = {
  question: '',
  options: ['', '', '', ''],
  correctAnswer: '',
  difficulty: 'Medium'
};

export default function AdminMockTestsPage() {
  const [companies, setCompanies] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    company: '',
    category: 'Coding',
    difficulty: 'Medium',
    duration: 30,
    questions: [emptyQuestion]
  });

  useEffect(() => {
    fetchCompanies();
    fetchResults();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await apiClient.get('/companies');
      setCompanies(response.data.companies || []);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await apiClient.get('/mock-tests/admin/results');
      setTests(response.data.tests || []);
    } catch (error) {
      console.error('Failed to fetch mock test results:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalAttempts = useMemo(
    () => tests.reduce((sum, test) => sum + (test.attemptsCount || 0), 0),
    [tests]
  );

  const handleQuestionChange = (index, field, value) => {
    setForm((prev) => {
      const questions = [...prev.questions];
      questions[index] = { ...questions[index], [field]: value };
      return { ...prev, questions };
    });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    setForm((prev) => {
      const questions = [...prev.questions];
      const options = [...questions[qIndex].options];
      options[optIndex] = value;
      questions[qIndex] = { ...questions[qIndex], options };
      return { ...prev, questions };
    });
  };

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, { ...emptyQuestion }]
    }));
  };

  const removeQuestion = (index) => {
    setForm((prev) => {
      if (prev.questions.length === 1) return prev;
      const questions = prev.questions.filter((_, i) => i !== index);
      return { ...prev, questions };
    });
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      company: '',
      category: 'Coding',
      difficulty: 'Medium',
      duration: 30,
      questions: [{ ...emptyQuestion }]
    });
  };

  const createTest = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        questions: form.questions.map((q) => ({
          ...q,
          options: q.options.filter(Boolean)
        }))
      };

      await apiClient.post('/mock-tests', payload);
      resetForm();
      setShowCreateForm(false);
      fetchResults();
    } catch (error) {
      console.error('Failed to create test:', error);
      alert(error?.response?.data?.error || 'Failed to create mock test');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Mock Tests</h1>
          <p className="text-zinc-400 mt-1">Create company-wise tests and monitor student results.</p>
        </div>
        <button
          onClick={() => setShowCreateForm((v) => !v)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {showCreateForm ? 'Close Form' : 'Create Mock Test'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Mock Tests" value={tests.length} icon={<ClipboardList className="w-5 h-5" />} />
        <StatCard title="Total Attempts" value={totalAttempts} icon={<BarChart3 className="w-5 h-5" />} />
        <StatCard
          title="Most Attempted"
          value={tests.length ? tests.slice().sort((a, b) => b.attemptsCount - a.attemptsCount)[0].title : '-'}
          icon={<BarChart3 className="w-5 h-5" />}
        />
      </div>

      {showCreateForm && (
        <form onSubmit={createTest} className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">New Mock Test</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              placeholder="Test title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white"
            />
            <select
              value={form.company}
              onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white"
            >
              <option value="">General (All Companies)</option>
              {companies.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <select
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white"
            >
              <option value="Coding">Coding</option>
              <option value="Aptitude">Aptitude</option>
              <option value="Technical">Technical</option>
              <option value="Verbal">Verbal</option>
              <option value="Logical">Logical</option>
            </select>
            <select
              value={form.difficulty}
              onChange={(e) => setForm((p) => ({ ...p, difficulty: e.target.value }))}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white"
            rows={3}
          />

          <input
            type="number"
            min={5}
            placeholder="Duration (minutes)"
            value={form.duration}
            onChange={(e) => setForm((p) => ({ ...p, duration: Number(e.target.value) }))}
            className="w-52 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white"
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Questions ({form.questions.length})</h3>
              <button
                type="button"
                onClick={addQuestion}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-sm"
              >
                + Add Question
              </button>
            </div>

            {form.questions.map((question, index) => (
              <div key={index} className="border border-zinc-800 rounded-lg p-4 bg-zinc-950/40 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-400">Question {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="text-red-400 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <textarea
                  required
                  placeholder="Question text"
                  value={question.question}
                  onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white"
                  rows={2}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {question.options.map((option, optIndex) => (
                    <input
                      key={optIndex}
                      required
                      placeholder={`Option ${optIndex + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white"
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    required
                    placeholder="Correct answer (must match one option exactly)"
                    value={question.correctAnswer}
                    onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white"
                  />
                  <select
                    value={question.difficulty}
                    onChange={(e) => handleQuestionChange(index, 'difficulty', e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg font-semibold"
          >
            {submitting ? 'Creating...' : 'Create Test'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Mock Test Results</h2>
        {loading ? (
          <div className="text-zinc-400">Loading results...</div>
        ) : tests.length === 0 ? (
          <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-6 text-zinc-400">
            No mock tests yet. Create one from the form above.
          </div>
        ) : (
          tests.map((test) => (
            <div key={test._id} className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-white font-semibold text-lg">{test.title}</h3>
                  <p className="text-zinc-400 text-sm">
                    {test.company || 'General'} | {test.category} | {test.difficulty}
                  </p>
                </div>
                <div className="text-sm text-zinc-300">
                  Attempts: <span className="text-white font-semibold">{test.attemptsCount}</span> | Avg Score: <span className="text-white font-semibold">{test.averageScore}</span> | Best: <span className="text-white font-semibold">{test.bestScore}</span>
                </div>
              </div>

              {test.attemptsCount === 0 ? (
                <p className="text-zinc-500 text-sm">No attempts submitted yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-zinc-400 border-b border-zinc-800">
                        <th className="py-2 pr-2">Student</th>
                        <th className="py-2 pr-2">Email</th>
                        <th className="py-2 pr-2">Score</th>
                        <th className="py-2 pr-2">%</th>
                        <th className="py-2 pr-2">Time (min)</th>
                        <th className="py-2">Attempted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {test.attempts.map((attempt, idx) => (
                        <tr key={idx} className="border-b border-zinc-800/60 text-zinc-200">
                          <td className="py-2 pr-2">{attempt.user?.fullName || 'Student'}</td>
                          <td className="py-2 pr-2 text-zinc-400">{attempt.user?.email || '-'}</td>
                          <td className="py-2 pr-2">{attempt.score}/{test.totalQuestions}</td>
                          <td className="py-2 pr-2">{attempt.percentage}%</td>
                          <td className="py-2 pr-2">{attempt.timeTaken || '-'}</td>
                          <td className="py-2">{new Date(attempt.attemptedAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-4">
      <div className="flex items-center gap-2 text-zinc-400 mb-2">
        {icon}
        <span className="text-sm">{title}</span>
      </div>
      <div className="text-white text-2xl font-bold break-words">{value}</div>
    </div>
  );
}
