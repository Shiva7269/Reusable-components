const nodemailer = require('nodemailer');

const sendEmailSMTP = async (to, subject, htmlContent) => {
	// try {
	// 	// Create a transporter using the SMTP protocol
	// 	let transporter = nodemailer.createTransport({
	// 		host: 'smtp-relay.brevo.com',
	// 		port: 587,
	// 		secure: true, // true for 465, false for other ports
	// 		auth: {
	// 			user: 'lalithkumar.vodala@techdenali.com', // your Gmail address
	// 			pass: 'hIfMpWAkDg75GrTz', // your App Password
	// 		},
	// 	});

	// 	// Set up email data (no need for accessToken)
	// 	const mailOptions = {
	// 		from: 'Lalith Kumar <lalithkumar.vodala@techdenali.com>',
	// 		to: to,
	// 		subject: subject,
	// 		text: htmlContent, // plaintext body
	// 		html: htmlContent, // HTML body content
	// 	};

	// 	// Send the email
	// 	const result = await transporter.sendMail(mailOptions);
	// 	console.log('Email sent:', result);
	// 	return result;
	// } 
	try {
        // Create a transporter using the SMTP protocol
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
              user: "lalithkumar.vodala@techdenali.com",
              pass: "hIfMpWAkDg75GrTz",
            },
          });

        // Set up email data (no need for accessToken)
        const mailOptions = {
            from: 'Lalith <lalithkumar.vodala@techdenali.com>',
            to: to,
            subject: subject,
            text: htmlContent, // plaintext body
            html: htmlContent, // HTML body content
        };

        // Send the email
        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent:', result);
        return result;
    }
	
	catch (error) {
		console.error('Failed to send email:', error);
		throw error;
	}
};

module.exports = { sendEmailSMTP };
