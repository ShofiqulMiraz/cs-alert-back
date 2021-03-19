const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASS,
    },
  });
  // define option
  const emailOptions = {
    from: '"Shofiqul Islam Miraz" <simiraz90@pm.me>', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    html: options.html, // html body
  };

  // send email
  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
