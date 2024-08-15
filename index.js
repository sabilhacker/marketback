require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 1020;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Stored in environment variables
    pass: process.env.EMAIL_PASS  // Stored in environment variables
  }
});

// Reusable email sending function
const sendEmail = (from, to, subject, text, res) => {
  const mailOptions = { from, to, subject, text };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error while sending email.', error });
    } else {
      console.log('Email sent:', info.response);
      return res.status(200).json({ message: 'Email sent successfully!' });
    }
  });
};

// Route to handle Franchise Details Form submission
app.post('/api/franchise-details', (req, res) => {
  const { firstName, lastName, phone, email, pinCode, area, propertyType, openingDate } = req.body;

  const emailText = `
    First Name: ${firstName}
    Last Name: ${lastName}
    Phone: ${phone}
    Email: ${email}
    Pin Code: ${pinCode}
    Area: ${area} sq. ft.
    Property Type: ${propertyType}
    Opening Date: ${openingDate}
  `;

  sendEmail(email, 'leadgen944@gmail.com', 'New Franchise Details Form Submission', emailText, res);
});

// Route to handle Contact Form submission
app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;

  const emailText = `
    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Message: ${message}
  `;

  sendEmail(email, 'leadgen944@gmail.com', 'New Contact Form Submission', emailText, res);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
