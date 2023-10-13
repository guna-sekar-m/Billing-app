const { createTransport } = require('nodemailer');

const mail = async (data,mailId)=>{
    
let transporter = createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'remotesharing01@gmail.com',
      pass: 'rxfw ungc qcne ecct' 
      },
      tls: {
        rejectUnauthorized: false
    }

  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: {
      name: 'Billing Software',
      address: 'remotesharing01@gmail.com'
    }, // sender address
    to: mailId, // list of receivers
    subject: "Billing Software Registration OTP", // Subject line
    text: "Your OTP is : "+data, // plain text body
    html: "Your OTP is :<b>"+data+"</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports = {mail}