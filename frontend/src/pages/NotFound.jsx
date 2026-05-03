import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 pt-20">
    <div className="text-center">
      <div className="font-display text-9xl font-bold text-blue-100 select-none">404</div>
      <h1 className="font-display text-2xl font-bold text-slate-800 -mt-4 mb-3">Page Not Found</h1>
      <p className="text-slate-500 mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
      >
        ← Go Back Home
      </Link>
    </div>
  </div>
);

export default NotFound;
