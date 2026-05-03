const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
};

/**
 * Send admin notification for new counselling booking
 */
const sendCounsellingBookingEmail = async ({ user, booking }) => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.warn('Mail credentials not configured. Skipping email notification.');
    return;
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"CareerPath Platform" <${process.env.MAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.MAIL_USER,
    subject: `🎯 New Counselling Booking - ${user.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 20px; border-radius: 6px 6px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New Counselling Booking!</h1>
        </div>
        
        <div style="padding: 24px;">
          <h2 style="color: #1e3a5f; border-bottom: 2px solid #2563eb; padding-bottom: 8px;">Student Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555; width: 40%;">Name:</td>
              <td style="padding: 8px 0; color: #222;">${user.name}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 8px; color: #222;">${user.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 8px 0; color: #222;">${user.email || 'Not provided'}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold; color: #555;">Class:</td>
              <td style="padding: 8px; color: #222;">${user.class}</td>
            </tr>
          </table>
          
          <h2 style="color: #1e3a5f; border-bottom: 2px solid #2563eb; padding-bottom: 8px; margin-top: 24px;">Booking Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555; width: 40%;">Date:</td>
              <td style="padding: 8px 0; color: #222;">${booking.date}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold; color: #555;">Time Slot:</td>
              <td style="padding: 8px; color: #222;">${booking.slot}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Payment Status:</td>
              <td style="padding: 8px 0;">
                <span style="background: #dcfce7; color: #16a34a; padding: 4px 12px; border-radius: 20px; font-weight: bold;">
                  ${booking.paymentStatus.toUpperCase()}
                </span>
              </td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold; color: #555;">Amount:</td>
              <td style="padding: 8px; color: #222;">₹${booking.amount / 100}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Payment ID:</td>
              <td style="padding: 8px 0; color: #222; font-family: monospace;">${booking.razorpayPaymentId}</td>
            </tr>
          </table>
          
          <div style="margin-top: 24px; padding: 16px; background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 4px;">
            <p style="margin: 0; color: #1e40af; font-weight: bold;">⚡ Action Required</p>
            <p style="margin: 8px 0 0 0; color: #1e40af;">Please reach out to the student and confirm the meeting details.</p>
          </div>
        </div>
        
        <div style="padding: 16px; background: #f3f4f6; border-radius: 0 0 6px 6px; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 12px;">CareerPath Platform Admin Notification • ${new Date().toLocaleString('en-IN')}</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send email notification:', error.message);
    // Don't throw — email failure shouldn't block the booking
  }
};

/**
 * Send confirmation email to student
 */
const sendStudentConfirmationEmail = async ({ user, booking }) => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS || !user.email) {
    return;
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"CareerPath Platform" <${process.env.MAIL_USER}>`,
    to: user.email,
    subject: `✅ Booking Confirmed - Career Counselling Session`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 20px; border-radius: 6px 6px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Booking Confirmed! 🎉</h1>
        </div>
        
        <div style="padding: 24px;">
          <p style="font-size: 16px; color: #333;">Hi <strong>${user.name}</strong>,</p>
          <p style="color: #555;">Your 1:1 career counselling session has been successfully booked. Here are your session details:</p>
          
          <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #0369a1; margin: 0 0 16px 0;">📅 Session Details</h3>
            <p style="margin: 8px 0;"><strong>Date:</strong> ${booking.date}</p>
            <p style="margin: 8px 0;"><strong>Time:</strong> ${booking.slot}</p>
            <p style="margin: 8px 0;"><strong>Counsellor:</strong> ${booking.counsellorName}</p>
            <p style="margin: 8px 0;"><strong>Duration:</strong> 45 Minutes</p>
          </div>
          
          <p style="color: #555;">Our team will contact you on <strong>${user.phone}</strong> with the final meeting link 30 minutes before your session.</p>
          
          <p style="color: #666; font-size: 14px;">If you need to reschedule, please contact us at least 24 hours in advance.</p>
        </div>
        
        <div style="padding: 16px; background: #f3f4f6; border-radius: 0 0 6px 6px; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 12px;">CareerPath Platform • Empowering Students Since 2024</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send student confirmation email:', error.message);
  }
};

module.exports = {
  sendCounsellingBookingEmail,
  sendStudentConfirmationEmail,
};
