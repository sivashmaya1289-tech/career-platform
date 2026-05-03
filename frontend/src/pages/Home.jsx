import { Link } from 'react-router-dom';

// ─── Stats ────────────────────────────────────────────────────────────────────
const stats = [
  { value: '5,000+', label: 'Students Guided' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '15+', label: 'Expert Counsellors' },
  { value: '3', label: 'Stream Insights' },
];

// ─── Problems ─────────────────────────────────────────────────────────────────
const problems = [
  {
    icon: '😰',
    title: 'Peer & Parent Pressure',
    desc: 'Being pushed toward engineering or medicine without knowing if it\'s really right for you.',
  },
  {
    icon: '🌀',
    title: 'Information Overload',
    desc: 'Too many options, too many opinions — and no clear way to tell what\'s best for your unique profile.',
  },
  {
    icon: '❓',
    title: 'No Self-Awareness',
    desc: 'You don\'t know your strengths, interests, or personality type — the foundation of every good career decision.',
  },
  {
    icon: '💸',
    title: 'Fear of Wrong Choice',
    desc: 'Terrified of picking the wrong stream and wasting years of effort and money.',
  },
];

// ─── Process Steps ────────────────────────────────────────────────────────────
const steps = [
  {
    num: '01',
    title: 'Join Free Webinar',
    desc: 'Attend our live session to understand different career paths, market demands, and what suits you.',
    cta: { label: 'Register Now', to: '/webinar/register' },
    color: 'from-blue-500 to-blue-700',
  },
  {
    num: '02',
    title: 'Take Career Test',
    desc: 'Answer 15 curated questions to discover whether Engineering, Medical, or Commerce aligns with your nature.',
    cta: { label: 'Take Free Test', to: '/test' },
    color: 'from-violet-500 to-violet-700',
  },
  {
    num: '03',
    title: 'Book 1:1 Counselling',
    desc: 'Get personalized, expert guidance in a private 45-minute session built around your goals and scores.',
    cta: { label: 'Book Session', to: '/counselling' },
    color: 'from-amber-500 to-orange-600',
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Ananya Sharma',
    class: '12th Student, Pune',
    text: 'I was confused between PCB and PCM. The career test gave me clarity and the counsellor helped me realize I genuinely love biotech — not just medicine because my parents wanted it.',
    avatar: 'A',
    color: 'bg-blue-600',
  },
  {
    name: 'Rohan Patil',
    class: '10th Student, Nashik',
    text: 'The webinar was eye-opening. I never knew Commerce had so many exciting careers beyond CA. Booked the 1:1 session right after!',
    avatar: 'R',
    color: 'bg-violet-600',
  },
  {
    name: 'Priya Nair',
    class: '12th Student, Mumbai',
    text: 'Best ₹499 I ever spent. My counsellor helped me build an actual roadmap — entrance exams, backup options, everything. I feel 100% ready now.',
    avatar: 'P',
    color: 'bg-emerald-600',
  },
];

// ─── Home Component ───────────────────────────────────────────────────────────
const Home = () => {
  return (
    <div className="min-h-screen">
      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-28 pb-20 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-medium px-4 py-2 rounded-full mb-6 animate-fade-in-up">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            India's #1 Student Career Guidance Platform
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in-up animation-delay-100">
            Don't Let Others{' '}
            <span className="italic text-blue-400">Decide</span>
            <br />
            Your Future
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up animation-delay-200">
            Expert career counselling for students after 10th & 12th. Discover your strengths, explore the right stream, and build a career you'll love.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
            <Link
              to="/webinar/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-xl shadow-blue-900/50 hover:shadow-2xl hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Register for Free Webinar
            </Link>
            <Link
              to="/test"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Take Free Career Test
            </Link>
            <Link
              to="/counselling"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-xl shadow-amber-900/30 hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Book 1:1 Counselling
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────────── */}
      <section className="bg-blue-700 py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center text-white">
              <div className="font-display text-3xl font-bold">{stat.value}</div>
              <div className="text-blue-200 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLEM ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-tag">The Problem</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
              Sound familiar?
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              Thousands of students make career decisions based on pressure, trends, or guesswork — and regret it later.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {problems.map((p) => (
              <div
                key={p.title}
                className="card flex items-start gap-4 hover:shadow-lg transition-shadow"
              >
                <span className="text-3xl shrink-0">{p.icon}</span>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{p.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-tag">The Solution</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
              A Proven 3-Step Path to Clarity
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              We've helped 5,000+ students stop guessing and start growing. Here's how.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.num}
                className="relative card group hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-transparent hover:border-blue-500"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} text-white font-display text-lg font-bold mb-4 shadow-lg`}
                >
                  {step.num}
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-5">{step.desc}</p>
                <Link
                  to={step.cta.to}
                  className="text-blue-600 font-semibold text-sm hover:text-blue-800 flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  {step.cta.label}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-tag">Testimonials</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
              Students Who Found Their Path
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 ${t.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{t.name}</div>
                    <div className="text-slate-400 text-xs">{t.class}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-700 to-indigo-800 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Your career starts with one decision
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            Don't leave it to chance. Take the first step with a free webinar or career test — no cost, no commitment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/webinar/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-4 rounded-xl transition-all shadow-xl hover:-translate-y-0.5"
            >
              Join Free Webinar
            </Link>
            <Link
              to="/counselling"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5"
            >
              Book 1:1 Session — ₹499
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
