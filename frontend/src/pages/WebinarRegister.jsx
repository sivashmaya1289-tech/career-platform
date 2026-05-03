import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormInput, FormSelect, Button, Alert } from '../components/UI';
import { registerWebinar } from '../utils/api';

const classOptions = [
  { value: '10th', label: 'Currently in 10th' },
  { value: '12th', label: 'Currently in 12th' },
  { value: 'Passed 10th', label: 'Passed 10th (planning stream)' },
  { value: 'Passed 12th', label: 'Passed 12th (gap year/re-evaluation)' },
];

const WebinarRegister = () => {
  const [form, setForm] = useState({ name: '', phone: '', class: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      newErrors.name = 'Please enter your full name (min 2 characters)';
    if (!/^[6-9]\d{9}$/.test(form.phone))
      newErrors.phone = 'Enter a valid 10-digit mobile number';
    if (!form.class) newErrors.class = 'Please select your current class';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await registerWebinar(form);
      setSuccess(true);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  if (success) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4 bg-slate-50">
        <div className="card max-w-md w-full text-center py-12 animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">
            You're Registered! 🎉
          </h2>
          <p className="text-slate-500 mb-2">
            Hi <strong>{form.name}</strong>, you've successfully registered for the webinar.
          </p>
          <p className="text-slate-500 text-sm mb-8">
            The meeting link and timing details will be sent to <strong>{form.phone}</strong> via SMS 1 hour before the session.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/test" className="btn-primary justify-center">
              Take Free Career Test →
            </Link>
            <Link to="/" className="btn-secondary justify-center">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-slate-50">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/webinar" className="text-blue-600 text-sm hover:underline flex items-center justify-center gap-1 mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Webinar Info
          </Link>
          <span className="section-tag">Free Webinar</span>
          <h1 className="font-display text-3xl font-bold text-slate-900">Reserve Your Seat</h1>
          <p className="text-slate-500 mt-2 text-sm">
            Spots fill up fast. Register now to confirm your place.
          </p>
        </div>

        <div className="card animate-fade-in-up">
          {apiError && (
            <div className="mb-4">
              <Alert type="error" message={apiError} onClose={() => setApiError('')} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <FormInput
              label="Full Name"
              required
              placeholder="e.g. Rahul Sharma"
              value={form.name}
              onChange={handleChange('name')}
              error={errors.name}
            />
            <FormInput
              label="WhatsApp / Mobile Number"
              required
              type="tel"
              placeholder="10-digit mobile number"
              maxLength={10}
              value={form.phone}
              onChange={handleChange('phone')}
              error={errors.phone}
            />
            <FormSelect
              label="Current Class"
              required
              options={classOptions}
              value={form.class}
              onChange={handleChange('class')}
              error={errors.class}
            />

            <Button type="submit" loading={loading} className="w-full justify-center mt-2">
              {loading ? 'Registering...' : 'Register for Free Webinar'}
            </Button>
          </form>

          <p className="text-center text-slate-400 text-xs mt-4">
            🔒 Your details are safe. No spam, ever.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WebinarRegister;
