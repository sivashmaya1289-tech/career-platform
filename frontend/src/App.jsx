import { BrowserRouter as Router, Routes, Route, ScrollRestoration } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { LoadingSpinner } from './components/UI';

// Lazy-loaded pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Webinar = lazy(() => import('./pages/Webinar'));
const WebinarRegister = lazy(() => import('./pages/WebinarRegister'));
const Test = lazy(() => import('./pages/Test'));
const Counselling = lazy(() => import('./pages/Counselling'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Scroll to top on route change
const ScrollToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
  }
  return null;
};

// Page loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center pt-20">
    <LoadingSpinner message="Loading..." />
  </div>
);

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/webinar" element={<Webinar />} />
              <Route path="/webinar/register" element={<WebinarRegister />} />
              <Route path="/test" element={<Test />} />
              <Route path="/counselling" element={<Counselling />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
