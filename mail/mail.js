import "dotenv/config";
import nodemailer from "nodemailer";

const { MAIL_USERNAME, MAIL_PASSWORD, MAIL_SENDER } = process.env;

const transport = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  auth: {
    user: MAIL_USERNAME,
    pass: MAIL_PASSWORD,
  },
});

function sendMail(email, token) {
  const message = {
    to: email,
    from: MAIL_SENDER,
    subject: "Email Confirmation",
    html: `Thank you for registration, to confirm your email please go to this link <a href="http://localhost:3000/api/users/verify/${token}">Confirm registration</a>`,
    text: `Thank you for registration, to confirm your email please go to this link http://localhost:3000/api/users/verify/${token}`,
  };

  return transport.sendMail(message);
}

export default { sendMail };
