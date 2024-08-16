const sgMail = require('@sendgrid/mail')
const EMAIL_USER = 'madstage.team@gmail.com';
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

async function sendEmail(to, subject, html) {
  
  sgMail.setApiKey(SENDGRID_API_KEY)
  const msg = {
    to: to,
    from: EMAIL_USER,
    subject: subject.toString(),
    text: subject.toString(),
    html: html
  }

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent.')
    })
    .catch((error) => {
      console.error(error)
      console.error(JSON.stringify(error))
    })
}

module.exports = sendEmail;