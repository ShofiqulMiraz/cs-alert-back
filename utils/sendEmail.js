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
    from: '"shofiqul islam miraz" <simiraz90@gmail.com>', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    // text: options.message, // plain text body
    html: options.html, // html body
  };

  // send email
  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
