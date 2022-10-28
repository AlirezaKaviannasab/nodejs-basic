const nodeMailer = require('nodemailer');
const sendEmail = async (options) => {
  //1 create a transporter
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
    },
  });
  //2 define the email options
  const emailOptions = {
    from: 'AlirezaKaviannasab <alirezakn@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html : 
  };
  //3 send the email
  transporter.sendMail(emailOptions)
};
module.exports = sendEmail