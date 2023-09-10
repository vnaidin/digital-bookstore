const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    transportMethod: "SMTP",
    secureConnection: true,
    port: 465,
    secure: true, // upgrade later with STARTTLS
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_SENDER_PASS
    }
});

transporter.use('compile', hbs({
    viewEngine: {
        extName: '.hbs',
        partialsDir: './views/',//your path, views is a folder inside the source folder
        layoutsDir: './views/',
        defaultLayout: ''//set this one empty and provide your template below,
    },
    viewPath: './views/',
    extName: '.hbs'
}));

const mailSender = {
    transporter: transporter,
};
module.exports = mailSender;