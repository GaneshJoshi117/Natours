const nodemailerSendgrid = require('nodemailer-sendgrid');
const nodemailer = require('nodemailer');

const pug = require('pug');
const { convert } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from =
      process.env.NODE_ENV === 'production'
        ? 'Ganesh Joshi<ganeshjoshi583@gmail.com>'
        : `Ganesh Joshi<joshiganesh@mail.com>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'development') {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
        //activate "less secure app" option in gmail
      });
    } else if (process.env.NODE_ENV === 'production') {
      //sendgrid
      return nodemailer.createTransport({
        service: 'SendinBlue', // either provide service name OR host, port info
        host: 'smtp-relay.sendinblue.com',
        port: 587,
        auth: {
          user: 'ganeshjoshi583@gmail.com',
          pass: 'xsmtpsib-23acc2902a960427e4bc5d0d12fd10c6c022236ec2a6804897ca6ac3104a215f-GHOkxs2rzU48BqpD',
        },
      });
      // return nodemailer.createTransport(
      //   nodemailerSendgrid({
      //     apiKey: process.env.SENDGRID_PASSWORD,
      //   })
      // );
    }
  }
  async send(template, subject) {
    //send the actual email
    //1)Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    //2)Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html, {
        wordwrap: false,
      }),
      // html
    };
    //3)Create a transport and send the email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family');
  }

  async sendPasswordReset() {
    await this.send(
      'passReset',
      'Your password reset token(Valid for 10 minutes)'
    );
  }
};
