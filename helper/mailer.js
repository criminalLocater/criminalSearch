const nodemailer = require("nodemailer");

class Mailer {
    constructor(service, user, pass) {
        // Step 1: Create a transporter object using SMTP
        this.transporter = nodemailer.createTransport({
            service: service, // e.g., 'Gmail', 'Yahoo', etc.
            auth: {
                user: user, // sender email
                pass: pass, // sender password or app password
            },
        });
    }
    async sendMail(mailObj) {
        // Step 2: Define email options
        const mailOptions = {
            from: this.transporter.options.auth.user, // sender email
            to: mailObj.to, // recipient email
            subject: mailObj.subject, // email subject
            text: mailObj.text, // plain text body
            html: mailObj.html // html body (optional) 
            // html: "<h1>Hello!</h1><p>This is a <b>test email</b> sent using Nodemailer.</p>", // html body (optional)
        };
        try {
            // Step 3: Send email
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Email sent successfully:", info.messageId);
            return info;
        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }
}
module.exports = Mailer;
