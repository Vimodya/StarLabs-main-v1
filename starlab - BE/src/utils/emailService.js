import nodemailer from 'nodemailer';

// Generate a transporter based on environment variables
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_USER || 'demoUserId',
      pass: process.env.SMTP_PASS || 'demoPass',
    },
  });
};

/**
 * Send a notification email to a list of users
 * @param {Array<String>} emails Array of recipient email addresses
 * @param {String} subject Subject line
 * @param {String} htmlBody HTML email body
 */
export const sendBulkNotification = async (emails, subject, htmlBody) => {
  try {
    const transporter = createTransporter();
    
    // Send email to all recipients. Bcc is used to protect privacy.
    const mailOptions = {
      from: '"StarLabs Team" <noreply@starlabs.com>',
      bcc: emails,
      subject: subject,
      html: htmlBody,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Notification sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
};
