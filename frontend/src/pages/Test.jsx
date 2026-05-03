import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormInput, FormSelect, Button, Alert, StepIndicator } from '../components/UI';
import { submitTest } from '../utils/api';

const classOptions = [
  { value: '10th', label: 'Currently in 10th' },
  { value: '12th', label: 'Currently in 12th' },
  { value: 'Passed 10th', label: 'Passed 10th' },
  { value: 'Passed 12th', label: 'Passed 12th' },
];

const QUESTIONS = [
  // Engineering (Q1-Q5)
  'Do you enjoy solving mathematical or logical puzzles?',
  'Are you curious about how machines, software, or technology works?',
  'Do you like experimenting and building things — physical or digital?',
  'Do subjects like Physics, Chemistry, or Computer Science excite you?',
  'Can you concentrate on technical tasks for long periods without getting bored?',
  // Medical (Q6-Q10)
  'Do you feel genuine concern and empathy when someone around you is ill?',
  'Are you fascinated by how the human body works (biology, anatomy)?',
  'Do you have the patience to observe, analyse, and follow detailed procedures?',
  'Would you be comfortable working in clinical environments (hospitals, labs)?',
  'Do you find topics like nutrition, disease, or mental health genuinely interesting?',
  // Commerce (Q11-Q15)
  'Do you enjoy talking, negotiating, or convincing people?',
  'Are you interested in how businesses make money or how markets work?',
  'Do you naturally think about money, savings, investments, or economics?',
  'Do you enjoy leading group activities or taking initiative in projects?',
  'Would you enjoy working in roles that involve strategy, planning, or management?',
];

const ANSWER_OPTIONS = [
  { value: 'yes', label: 'Yes', emoji: '✅', color: 'border-green-400 bg-green-50 text-green-800' },
  { value: 'sometimes', label: 'Sometimes', emoji: '🤔', color: 'border-amber-400 bg-amber-50 text-amber-800' },
  { value: 'no', label: 'No', emoji: '❌', color: 'border-red-300 bg-red-50 text-red-700' },
];

const RESULT_META = {
  'Engineering & Technology': {
    icon: '⚙️',
    color: 'from-blue-600 to-indigo-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    careers: ['Software Engineer', 'Data Scientist', 'Mechanical Engineer', 'Electronics Engineer', 'AI/ML Researcher'],
    streams: ['PCM (Physics, Chemistry, Math)', 'Computer Science', 'Information Technology'],
    entrance: ['JEE Main & Advanced', 'BITSAT', 'State CETs (MHT-CET, KCET, etc.)'],
  },
  'Medical & Life Sciences': {
    icon: '🏥',
    color: 'from-emerald-600 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    careers: ['Doctor (MBBS)', 'Dentist (BDS)', 'Pharmacist', 'Biotech Researcher', 'Clinical Psychologist'],
    streams: ['PCB (Physics, Chemistry, Biology)', 'Biotechnology', 'Nursing'],
    entrance: ['NEET-UG', 'AIIMS PG', 'JIPMER', 'State Medical CETs'],
  },
  'Commerce & Business': {
    icon: '📈',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    careers: ['Chartered Accountant', 'MBA Graduate', 'Entrepreneur', 'Financial Analyst', 'Marketing Manager'],
    streams: ['Commerce with Math', 'Commerce without Math', 'BBA / BCom / Economics'],
    entrance: ['CA Foundation', 'CLAT', 'IPM Indore', 'CUET', 'IPMAT'],
  },
};

const STEPS = ['Register', 'Take Test', 'Your Result'];

const Test = () => {
  const [step, setStep] = useState(1); // 1=register, 2=test, 3=result
  const [form, setForm] = useState({ name: '', phone: '', class: '' });
  const [formErrors, setFormErrors] = useState({});
  const [answers, setAnswers] = useState(Array(15).fill(null));
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateRegistration = () => {
    const errors = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errors.name = 'Please enter your full name';
    if (!/^[6-9]\d{9}$/.test(form.phone))
      errors.phone = 'Enter a valid 10-digit mobile number';
    if (!form.class) errors.class = 'Please select your class';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (validateRegistration()) setStep(2);
  };

  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = value;
    setAnswers(newAnswers);
    // Auto-advance
    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 350);
    }
  };

  const handleSubmitTest = async () => {
    if (answers.includes(null)) {
      setApiError('Please answer all 15 questions before submitting.');
      return;
    }
    setLoading(true);
    setApiError('');
    try {
      const response = await submitTest({ ...form, answers });
      setResult(response.data);
      setStep(3);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const answeredCount = answers.filter((a) => a !== null).length;
  const progress = (answeredCount / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-slate-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="section-tag">Free Career Test</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
            Discover Your Stream
          </h1>
          <p className="text-slate-500 mt-2">
            Answer 15 questions honestly. Takes 3–5 minutes.
          </p>
        </div>

        <StepIndicator steps={STEPS} currentStep={step} />

        {/* ── STEP 1: Registration ── */}
        {step === 1 && (
          <div className="card animate-fade-in-up">
            <h2 className="font-semibold text-slate-800 mb-5">Quick Registration</h2>
            {apiError && <Alert type="error" message={apiError} onClose={() => setApiError('')} className="mb-4" />}
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <FormInput
                label="Full Name"
                required
                placeholder="e.g. Anjali Mehta"
                value={form.name}
                onChange={(e) => {
                  setForm((p) => ({ ...p, name: e.target.value }));
                  if (formErrors.name) setFormErrors((p) => ({ ...p, name: '' }));
                }}
                error={formErrors.name}
              />
              <FormInput
                label="Mobile Number"
                required
                type="tel"
                placeholder="10-digit mobile number"
                maxLength={10}
                value={form.phone}
                onChange={(e) => {
                  setForm((p) => ({ ...p, phone: e.target.value }));
                  if (formErrors.phone) setFormErrors((p) => ({ ...p, phone: '' }));
                }}
                error={formErrors.phone}
              />
              <FormSelect
                label="Current Class"
                required
                options={classOptions}
                value={form.class}
                onChange={(e) => {
                  setForm((p) => ({ ...p, class: e.target.value }));
                  if (formErrors.class) setFormErrors((p) => ({ ...p, class: '' }));
                }}
                error={formErrors.class}
              />
              <Button type="submit" className="w-full justify-center">
                Start Career Test →
              </Button>
            </form>
          </div>
        )}

        {/* ── STEP 2: Questions ── */}
        {step === 2 && (
          <div className="animate-fade-in">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-slate-500 mb-2">
                <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
                <span>{answeredCount} answered</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full progress-bar-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question card */}
            <div className="card mb-4 animate-fade-in-up">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold shrink-0">
                  {currentQ + 1}
                </div>
                <h3 className="font-semibold text-slate-800 text-lg leading-snug pt-0.5">
                  {QUESTIONS[currentQ]}
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {ANSWER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 font-semibold text-sm transition-all hover:scale-105 active:scale-95 ${
                      answers[currentQ] === opt.value
                        ? opt.color + ' border-2 shadow-md scale-105'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                disabled={currentQ === 0}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              {currentQ < QUESTIONS.length - 1 ? (
                <button
                  onClick={() => setCurrentQ(currentQ + 1)}
                  disabled={answers[currentQ] === null}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 disabled:opacity-30 disabled:cursor-not-allowed font-medium text-sm transition-all"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <Button onClick={handleSubmitTest} loading={loading} variant="gold">
                  {loading ? 'Calculating...' : 'Submit & See Result 🎯'}
                </Button>
              )}
            </div>

            {/* Jump to question */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {QUESTIONS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQ(i)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                    i === currentQ
                      ? 'bg-blue-600 text-white shadow-md'
                      : answers[i] !== null
                      ? 'bg-green-400 text-white'
                      : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {apiError && (
              <div className="mt-4">
                <Alert type="error" message={apiError} onClose={() => setApiError('')} />
              </div>
            )}
          </div>
        )}

        {/* ── STEP 3: Result ── */}
        {step === 3 && result && (
          <div className="animate-fade-in-up">
            {/* Main result card */}
            {(() => {
              const meta = RESULT_META[result.result];
              return (
                <>
                  <div className={`card border-2 ${meta.border} ${meta.bg} text-center mb-6`}>
                    <div className="text-6xl mb-4">{meta.icon}</div>
                    <p className="text-slate-500 text-sm font-medium mb-1">Based on your answers, your ideal stream is:</p>
                    <h2
                      className={`font-display text-3xl font-bold mb-3 bg-gradient-to-r ${meta.color} bg-clip-text text-transparent`}
                    >
                      {result.result}
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto">
                      {result.resultDescription}
                    </p>

                    {/* Scores */}
                    <div className="grid grid-cols-3 gap-3 mt-6">
                      {[
                        { label: 'Engineering', score: result.scores.engineering, max: 15 },
                        { label: 'Medical', score: result.scores.medical, max: 15 },
                        { label: 'Commerce', score: result.scores.commerce, max: 15 },
                      ].map((s) => (
                        <div key={s.label} className="bg-white rounded-xl p-3 shadow-sm">
                          <div className="text-xl font-bold text-slate-800">{s.score}/15</div>
                          <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                          <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full progress-bar-fill"
                              style={{ width: `${(s.score / s.max) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Career paths */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="card">
                      <h4 className="font-semibold text-slate-700 text-sm mb-3 flex items-center gap-1.5">
                        <span>🎯</span> Career Paths
                      </h4>
                      <ul className="space-y-1.5">
                        {meta.careers.map((c) => (
                          <li key={c} className="text-slate-600 text-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="card">
                      <h4 className="font-semibold text-slate-700 text-sm mb-3 flex items-center gap-1.5">
                        <span>📚</span> Recommended Streams
                      </h4>
                      <ul className="space-y-1.5">
                        {meta.streams.map((s) => (
                          <li key={s} className="text-slate-600 text-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="card">
                      <h4 className="font-semibold text-slate-700 text-sm mb-3 flex items-center gap-1.5">
                        <span>✍️</span> Key Entrance Exams
                      </h4>
                      <ul className="space-y-1.5">
                        {meta.entrance.map((e) => (
                          <li key={e} className="text-slate-600 text-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0" />
                            {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Next steps CTA */}
                  <div className="card bg-gradient-to-br from-blue-700 to-indigo-800 text-white text-center">
                    <h3 className="font-display text-xl font-bold mb-2">Want a personalised roadmap?</h3>
                    <p className="text-blue-200 text-sm mb-5">
                      A 45-minute 1:1 session with our expert will build your complete career plan — entrance exams, colleges, backup options.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link
                        to="/counselling"
                        className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5"
                      >
                        Book 1:1 Counselling — ₹499 →
                      </Link>
                      <Link
                        to="/"
                        className="inline-flex items-center justify-center bg-white/15 hover:bg-white/25 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                      >
                        Go Home
                      </Link>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Test;
