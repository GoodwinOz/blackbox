const nodemailer = require("nodemailer");
const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
require('dotenv').config()
// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
//   let testAccount = await nodemailer.createTestAccount();

//   // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'testingautotests@gmail.com', // generated ethereal user
      pass: process.env.MAIL_PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let report = await transporter.sendMail({
    from: 'testingautotests@gmail.com', // sender address
    to: "bohdan.khokhlov@computools.com", // list of receivers: "bar@example.com, baz@example.com"
    subject: "Test ✔", // Subject line
    text: "Testing process of sending html report", // plain text body
    // html: "<b>Hello world?</b>", // html body
    html: await readFile('./reports/index.html', 'utf8')
  });

  console.log("Message sent: %s", report.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(report));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  await transporter.close()
}

main().catch(console.error);