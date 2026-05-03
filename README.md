# 🎓 CareerPath — Career Counselling Platform

A full-stack career counselling platform for students after 10th & 12th, built with React, Node.js, MongoDB, Razorpay, and Tailwind CSS.

---

## 📁 Folder Structure

```
career-platform/
├── backend/
│   ├── models/
│   │   ├── User.js                  # User schema (name, phone, email, class, type)
│   │   ├── WebinarRegistration.js   # Webinar registration records
│   │   ├── TestResult.js            # Career test answers & results
│   │   └── CounsellingBooking.js    # Booking + payment records
│   ├── routes/
│   │   ├── webinar.js               # POST /api/webinar/register
│   │   ├── test.js                  # POST /api/test/submit
│   │   └── payment.js               # POST /api/payment/create-order, /verify
│   │                                # POST /api/counselling/book
│   ├── utils/
│   │   └── mailer.js                # Nodemailer admin + student emails
│   ├── server.js                    # Express app entry point
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx            # Responsive sticky navbar
    │   │   ├── Footer.jsx            # Footer with links
    │   │   └── UI.jsx                # Button, FormInput, Alert, StepIndicator, etc.
    │   ├── pages/
    │   │   ├── Home.jsx              # Landing page (Hero, Stats, Problems, Steps, Testimonials)
    │   │   ├── Webinar.jsx           # Webinar info page
    │   │   ├── WebinarRegister.jsx   # Webinar registration form
    │   │   ├── Test.jsx              # 15-question career test + result
    │   │   ├── Counselling.jsx       # Counselling: Register → Pay → Slot → Confirm
    │   │   └── NotFound.jsx          # 404 page
    │   ├── utils/
    │   │   └── api.js                # Axios API calls
    │   ├── App.jsx                   # React Router v6 setup
    │   ├── main.jsx                  # React entry point
    │   └── index.css                 # Tailwind + custom styles
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── netlify.toml
    ├── package.json
    └── .env.example
```

---

## ⚙️ Tech Stack

| Layer     | Tech                              |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, React Router v6   |
| Styling   | Tailwind CSS, DM Sans + Playfair Display |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB Atlas + Mongoose          |
| Payments  | Razorpay (India)                  |
| Email     | Nodemailer (Gmail SMTP)           |
| Deploy    | Netlify (Frontend) + Render (Backend) |

---

## 🚀 Local Setup (Step-by-Step)

### Prerequisites
- Node.js v18+ installed
- MongoDB Atlas account (free tier)
- Razorpay account (test mode is fine)
- Gmail account with App Password enabled

---

### Step 1 — Clone / Set up the project

```bash
# If using git
git clone https://github.com/yourname/career-platform.git
cd career-platform

# OR just navigate into the folder you created
```

---

### Step 2 — Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/career-platform
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=youremail@gmail.com
MAIL_PASS=your_16_char_app_password
ADMIN_EMAIL=admin@yourdomain.com
FRONTEND_URL=http://localhost:5173
```

> **Getting Gmail App Password:**
> 1. Go to your Google Account → Security
> 2. Enable 2-Step Verification
> 3. Search "App Passwords" → Create one for "Mail"
> 4. Use the 16-character code as `MAIL_PASS`

Start the backend:

```bash
npm run dev
# Runs on http://localhost:5000
```

Test it: Visit `http://localhost:5000/api/health` — you should see a JSON success response.

---

### Step 3 — Set up the Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file:

```bash
cp .env.example .env
```

For local development, the Vite proxy is already configured in `vite.config.js` to forward `/api` calls to `http://localhost:5000`, so you **don't need to set `VITE_API_URL`** locally.

Start the frontend:

```bash
npm run dev
# Runs on http://localhost:5173
```

Open `http://localhost:5173` in your browser. 🎉

---

## 🔌 API Reference

| Method | Endpoint                    | Description                          |
|--------|-----------------------------|--------------------------------------|
| GET    | `/api/health`               | Health check                         |
| POST   | `/api/webinar/register`     | Register for webinar                 |
| POST   | `/api/test/submit`          | Submit career test answers           |
| POST   | `/api/payment/create-order` | Create Razorpay order                |
| POST   | `/api/payment/verify`       | Verify Razorpay payment signature    |
| POST   | `/api/counselling/book`     | Book a counselling slot post-payment |

---

## 💳 Razorpay Integration Flow

```
Frontend                     Backend                    Razorpay
   |                             |                          |
   |-- POST /payment/create-order -->                       |
   |                             |-- Create Order --------> |
   |                             |<-- order_id ------------ |
   |<-- { orderId, keyId } ------                           |
   |                                                        |
   |-- Open Razorpay Checkout --------------------------->  |
   |                          (User pays)                   |
   |<-- { payment_id, order_id, signature } <-------------- |
   |                                                        |
   |-- POST /payment/verify -->                             |
   |                           |-- Verify HMAC-SHA256       |
   |                           |-- Update DB to 'paid'      |
   |<-- { success: true } -----                             |
   |                                                        |
   |-- POST /counselling/book -->                           |
   |<-- Booking confirmed ------                            |
```

---

## 🧮 Career Test Scoring Logic

| Question # | Stream           | Yes | Sometimes | No |
|------------|------------------|-----|-----------|-----|
| 1–5        | Engineering/Tech | 3   | 1         | 0  |
| 6–10       | Medical/Biology  | 3   | 1         | 0  |
| 11–15      | Commerce/Business| 3   | 1         | 0  |

**Result** = stream with the highest total score (max 15 per stream).

---

## 🌐 Deployment Guide

### Frontend → Netlify

1. Push your `frontend/` folder to GitHub
2. Go to [netlify.com](https://netlify.com) → New Site → Import from Git
3. Build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
4. Add environment variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
5. Deploy! The `netlify.toml` handles SPA routing automatically.

---

### Backend → Render

1. Push your `backend/` folder to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Node 18
4. Add all environment variables from your `.env`
5. Set `FRONTEND_URL` to your Netlify URL (e.g. `https://careerpath.netlify.app`)
6. Deploy!

---

### Backend → Railway (alternative)

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Set root to `backend/`
4. Add environment variables in the Variables tab
5. Railway auto-detects `npm start`

---

## 🔐 Security Notes

- Never commit your `.env` file — it's in `.gitignore`
- Use Razorpay **test keys** during development and **live keys** in production
- The payment signature verification uses HMAC-SHA256 — never skip this step
- Gmail App Password is more secure than using your main password

---

## 📧 Email Notifications

When a student successfully books a counselling session:
1. **Admin email** is sent with full student + booking details
2. **Student confirmation email** is sent if email was provided

If email is not configured, the app continues to work — email failures are logged but don't block the booking.

---

## 🛠 Customisation Tips

| What to change | Where |
|----------------|-------|
| Counselling price (₹499) | `backend/models/CounsellingBooking.js` → `amount: 49900` |
| Test questions | `frontend/src/pages/Test.jsx` → `QUESTIONS` array |
| Webinar date/time | `frontend/src/pages/Webinar.jsx` |
| Time slots | `frontend/src/pages/Counselling.jsx` → `TIME_SLOTS` |
| Available dates | `frontend/src/pages/Counselling.jsx` → `getAvailableDates()` |
| Scoring weights | `backend/routes/test.js` → `calculateScores()` |

---

Made with ❤️ for Indian students. Good luck! 🎓
