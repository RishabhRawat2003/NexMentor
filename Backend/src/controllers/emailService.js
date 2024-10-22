import nodemailer from 'nodemailer'

export const sendVerificationEmail = async (email, message) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification - OTP',
        text: message
    };

    await transporter.sendMail(mailOptions);
};