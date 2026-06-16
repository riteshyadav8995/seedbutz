const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Seednutz Contact Form <onboarding@resend.dev>',
      to: process.env.EMAIL_USER, // send to admin
      subject: `New Inquiry: ${options.subject}`,
      text: `Name: ${options.name}\nEmail: ${options.email}\n\nMessage:\n${options.message}`
    });

    if (error) {
      console.error('Resend API Error:', error);
      return;
    }
    console.log('Contact Email sent successfully via Resend');
  } catch (err) {
    console.error('Error sending contact email:', err);
  }
};

const sendOtpEmail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Seednutz Auth <onboarding@resend.dev>',
      to: email, // Note: On Resend free tier, this must be your verified email address
      subject: `Your Seednutz OTP Code`,
      text: `Your OTP for registration is: ${otp}\n\nIt is valid for 5 minutes.`
    });

    if (error) {
      console.error('Resend API Error:', error);
      throw new Error(error.message);
    }
    console.log(`OTP Email sent successfully to ${email}`);
  } catch (err) {
    console.error('Error sending OTP email:', err);
    throw err;
  }
};

const sendPaymentEmail = async (email, subject, text) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Seednutz Orders <onboarding@resend.dev>',
      to: email, // Note: On Resend free tier, this must be your verified email address
      subject: subject,
      text: text
    });

    if (error) {
      console.error('Resend API Error:', error);
      return;
    }
    console.log(`Payment Email sent successfully to ${email}`);
  } catch (err) {
    console.error('Error sending payment email:', err);
  }
};

module.exports = { sendEmail, sendOtpEmail, sendPaymentEmail };
