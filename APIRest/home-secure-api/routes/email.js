var nodeemailer = require('nodemailer');

var sendEmail = function(email, subject, body) {
    console.log(email);
    
    let transporter = nodeemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mailpruebattech@gmail.com',
            pass: 'sup3rd3bi4n'
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: subject, // plain text body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    });
}

module.exports = {
    sendMail: sendEmail
}