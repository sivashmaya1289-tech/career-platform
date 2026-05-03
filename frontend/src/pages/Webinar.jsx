import { Link } from 'react-router-dom';

const highlights = [
  'Live Q&A with experienced career counsellors',
  'Understand Engineering vs Medical vs Commerce in depth',
  'Learn about emerging careers no one talks about',
  'Get your basic questions answered live',
  'Exclusive study roadmap for registered students',
  'Free resource kit via WhatsApp after session',
];

const agenda = [
  { time: '0:00', topic: 'Welcome & Introduction' },
  { time: '0:10', topic: 'The State of Careers in India 2025' },
  { time: '0:25', topic: 'Engineering & Technology Streams — Deep Dive' },
  { time: '0:45', topic: 'Medical & Life Sciences — What Nobody Tells You' },
  { time: '1:05', topic: 'Commerce, Finance & Business — The Underrated Giant' },
  { time: '1:25', topic: 'How to Know Which Stream Fits You' },
  { time: '1:40', topic: 'Live Q&A Session' },
  { time: '2:00', topic: 'Session Ends' },
];

const Webinar = () => {
  return (
    <div className="min-h-screen pt-20 bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 py-16 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Free • Online • Live
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Career Discovery Masterclass
          </h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto mb-8">
            A free 2-hour live session that helps you understand your options and pick the right path after 10th or 12th.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-300 mb-8">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Every Saturday, 11:00 AM IST
            </span>
            <span className="hidden sm:block text-slate-600">•</span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Google Meet (link sent via SMS)
            </span>
            <span className="hidden sm:block text-slate-600">•</span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              2 Hours
            </span>
          </div>
          <Link
            to="/webinar/register"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl transition-all shadow-xl shadow-blue-900/50 hover:shadow-2xl hover:-translate-y-0.5 text-lg"
          >
            Register for Free
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="text-slate-500 text-sm mt-3">Limited seats available each week</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Agenda */}
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">Session Agenda</h2>
          <div className="card space-y-0 overflow-hidden p-0">
            {agenda.map((item, i) => (
              <div
                key={item.time}
                className={`flex items-center gap-4 px-6 py-4 ${
                  i % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                } border-b border-slate-100 last:border-b-0`}
              >
                <span className="text-sm font-mono font-bold text-blue-600 w-14 shrink-0">
                  {item.time}
                </span>
                <span className="text-slate-700 text-sm">{item.topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">What You'll Get</h2>
          <div className="card space-y-4">
            {highlights.map((h) => (
              <div key={h} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-700 text-sm">{h}</span>
              </div>
            ))}

            <div className="pt-4 border-t border-slate-100">
              <Link
                to="/webinar/register"
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Reserve My Spot →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Webinar;
