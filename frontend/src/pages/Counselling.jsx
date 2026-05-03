import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormInput, FormSelect, Button, Alert, StepIndicator } from '../components/UI';
import { createPaymentOrder, verifyPayment, bookCounselling } from '../utils/api';

const classOptions = [
  { value: '10th', label: 'Currently in 10th' },
  { value: '12th', label: 'Currently in 12th' },
  { value: 'Passed 10th', label: 'Passed 10th' },
  { value: 'Passed 12th', label: 'Passed 12th' },
];

// Next 7 weekdays (Mon–Sat)
const getAvailableDates = () => {
  const dates = [];
  const today = new Date();
  let d = new Date(today);
  d.setDate(d.getDate() + 1);

  while (dates.length < 7) {
    const day = d.getDay(); // 0=Sun, 6=Sat
    if (day !== 0) {
      // Skip Sundays
      dates.push({
        value: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        label: d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }),
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return dates;
};

const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
];

const STEPS = ['Your Details', 'Payment', 'Pick a Slot', 'Confirmed'];

const Counselling = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', phone: '', email: '', class: '' });
  const [formErrors, setFormErrors] = useState({});
  const [bookingId, setBookingId] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const availableDates = getAvailableDates();

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errors.name = 'Please enter your full name';
    if (!/^[6-9]\d{9}$/.test(form.phone))
      errors.phone = 'Enter a valid 10-digit mobile number';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      errors.email = 'Enter a valid email address';
    if (!form.class) errors.class = 'Please select your class';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Load Razorpay script dynamically
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');

    try {
      // 1. Create Razorpay order on backend
      const orderResponse = await createPaymentOrder(form);
      const { orderId, amount, currency, bookingId: bId, keyId, prefill } =
        orderResponse.data;

      setBookingId(bId);

      // 2. Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error('Payment gateway failed to load. Please check your internet connection.');
      }

      // 3. Open Razorpay checkout
      const options = {
        key: keyId,
        amount,
        currency,
        name: 'CareerPath',
        description: '1:1 Career Counselling Session (45 min)',
        order_id: orderId,
        prefill,
        theme: {
          color: '#2563eb',
        },
        handler: async (response) => {
          try {
            // 4. Verify payment signature on backend
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: bId,
            });
            setStep(3); // Move to slot selection
          } catch (err) {
            setApiError('Payment verification failed: ' + err.message);
          }
        },
        modal: {
          ondismiss: () => {
            setApiError('Payment was cancelled. Please try again when you\'re ready.');
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setApiError('Payment failed: ' + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async () => {
    if (!selectedDate || !selectedSlot) {
      setApiError('Please select both a date and a time slot.');
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const response = await bookCounselling({
        bookingId,
        slot: selectedSlot,
        date: selectedDate,
      });
      setBookingDetails(response.data);
      setStep(4);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-slate-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="section-tag">1:1 Career Counselling</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
            Book Your Expert Session
          </h1>
          <p className="text-slate-500 mt-2">
            ₹499 for a 45-minute personalised career counselling session
          </p>
        </div>

        <StepIndicator steps={STEPS} currentStep={step} />

        {apiError && (
          <div className="mb-5">
            <Alert type="error" message={apiError} onClose={() => setApiError('')} />
          </div>
        )}

        {/* ── STEP 1: Registration + Payment ── */}
        {step === 1 && (
          <div className="animate-fade-in-up space-y-5">
            {/* What's included */}
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <span>✨</span> What's included in your ₹499 session
              </h3>
              <ul className="space-y-2">
                {[
                  '45 min private 1:1 with an expert counsellor',
                  'Personalised stream & career recommendations',
                  'Entrance exam roadmap tailored to you',
                  'Top college shortlist based on your profile',
                  'Post-session written summary on WhatsApp',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-blue-800">
                    <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Registration Form */}
            <div className="card">
              <h3 className="font-semibold text-slate-800 mb-5">Your Details</h3>
              <form onSubmit={handlePayment} className="space-y-4">
                <FormInput
                  label="Full Name"
                  required
                  placeholder="e.g. Arjun Verma"
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
                <FormInput
                  label="Email Address (optional)"
                  type="email"
                  placeholder="for session confirmation"
                  value={form.email}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, email: e.target.value }));
                    if (formErrors.email) setFormErrors((p) => ({ ...p, email: '' }));
                  }}
                  error={formErrors.email}
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

                <Button type="submit" loading={loading} variant="gold" className="w-full justify-center mt-2 text-base py-4">
                  {loading ? 'Processing...' : '🔒 Pay ₹499 & Continue'}
                </Button>

                <p className="text-center text-slate-400 text-xs">
                  Secure payment via Razorpay • UPI, Cards, Net Banking accepted
                </p>
              </form>
            </div>
          </div>
        )}

        {/* ── STEP 3: Slot Selection ── */}
        {step === 3 && (
          <div className="card animate-fade-in-up">
            <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">Payment successful! Now select your preferred session slot.</span>
            </div>

            <h3 className="font-semibold text-slate-800 mb-4">Select a Date</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {availableDates.map((date) => (
                <button
                  key={date.value}
                  onClick={() => setSelectedDate(date.value)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium text-left transition-all ${
                    selectedDate === date.value
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {date.label}
                </button>
              ))}
            </div>

            <h3 className="font-semibold text-slate-800 mb-4">Select a Time Slot</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-3 px-2 rounded-xl border-2 text-sm font-semibold transition-all text-center ${
                    selectedSlot === slot
                      ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-md'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            <Button
              onClick={handleBookSlot}
              loading={loading}
              className="w-full justify-center"
              disabled={!selectedDate || !selectedSlot}
            >
              {loading ? 'Booking...' : 'Confirm Session →'}
            </Button>
          </div>
        )}

        {/* ── STEP 4: Confirmation ── */}
        {step === 4 && bookingDetails && (
          <div className="card text-center animate-fade-in-up py-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">
              Session Confirmed! 🎉
            </h2>
            <p className="text-slate-500 mb-6">
              Hi <strong>{bookingDetails.studentName}</strong>, your session is booked.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-left mb-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Date</span>
                <span className="font-semibold text-slate-800">{bookingDetails.date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Time</span>
                <span className="font-semibold text-slate-800">{bookingDetails.slot}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Counsellor</span>
                <span className="font-semibold text-slate-800">{bookingDetails.counsellorName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Duration</span>
                <span className="font-semibold text-slate-800">45 Minutes</span>
              </div>
            </div>

            <p className="text-slate-500 text-sm mb-6">
              📱 We'll WhatsApp you the meeting link 30 minutes before your session.
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Counselling;
