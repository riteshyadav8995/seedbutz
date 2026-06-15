const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or use another service. For demo, we might just mock this or use ethereal.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `Seednutz Contact Form <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // send to admin
      subject: `New Inquiry: ${options.subject}`,
      text: `Name: ${options.name}\nEmail: ${options.email}\n\nMessage:\n${options.message}`
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const sendOtpEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `Seednutz Auth <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Seednutz OTP Code`,
      text: `Your OTP for registration is: ${otp}\n\nIt is valid for 5 minutes.`
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP Email sent successfully to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

const sendPaymentEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `Seednutz Orders <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: text
    };

    await transporter.sendMail(mailOptions);
    console.log(`Payment Email sent successfully to ${email}`);
  } catch (error) {
    console.error('Error sending payment email:', error);
  }
};

module.exports = { sendEmail, sendOtpEmail, sendPaymentEmail };
