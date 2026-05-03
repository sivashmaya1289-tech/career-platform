// ─── Button ───────────────────────────────────────────────────────────────────
export const Button = ({ children, variant = 'primary', loading = false, className = '', ...props }) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-white hover:bg-slate-50 text-blue-700 border-2 border-blue-600 hover:shadow-md',
    gold: 'bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
};

// ─── FormInput ────────────────────────────────────────────────────────────────
export const FormInput = ({ label, error, required = false, ...props }) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 rounded-lg border transition-all text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-400 bg-red-50' : 'border-slate-300'
        }`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1.5">{error}</p>}
    </div>
  );
};

// ─── FormSelect ───────────────────────────────────────────────────────────────
export const FormSelect = ({ label, error, required = false, options = [], ...props }) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={`w-full px-4 py-3 rounded-lg border transition-all text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-400 bg-red-50' : 'border-slate-300'
        }`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1.5">{error}</p>}
    </div>
  );
};

// ─── Alert ────────────────────────────────────────────────────────────────────
export const Alert = ({ type = 'info', message, onClose }) => {
  const styles = {
    success: 'bg-green-50 border-green-400 text-green-800',
    error: 'bg-red-50 border-red-400 text-red-800',
    warning: 'bg-amber-50 border-amber-400 text-amber-800',
    info: 'bg-blue-50 border-blue-400 text-blue-800',
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${styles[type]} animate-fade-in`}>
      <span className="text-lg shrink-0">{icons[type]}</span>
      <p className="text-sm flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="text-current opacity-60 hover:opacity-100 shrink-0">
          ✕
        </button>
      )}
    </div>
  );
};

// ─── LoadingSpinner ────────────────────────────────────────────────────────────
export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-4">
    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    <p className="text-slate-500 text-sm">{message}</p>
  </div>
);

// ─── StepIndicator ───────────────────────────────────────────────────────────
export const StepIndicator = ({ steps, currentStep }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {steps.map((step, index) => {
      const stepNum = index + 1;
      const isCompleted = stepNum < currentStep;
      const isActive = stepNum === currentStep;

      return (
        <div key={step} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${
              isCompleted
                ? 'bg-green-500 text-white'
                : isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            {isCompleted ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              stepNum
            )}
          </div>
          <span
            className={`hidden sm:block ml-2 text-xs font-medium mr-4 ${
              isActive ? 'text-blue-700' : 'text-slate-400'
            }`}
          >
            {step}
          </span>
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 w-8 mx-1 rounded ${isCompleted ? 'bg-green-400' : 'bg-slate-200'}`}
            />
          )}
        </div>
      );
    })}
  </div>
);
