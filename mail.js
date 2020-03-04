const nodemailer = require("nodemailer");

module.exports.send_mail = async function (fromName, to, subject, body, attachment_name, attachment_path) {
	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: process.env.MAIL_HOST,
		port: process.env.MAIL_PORT,
		secure: process.env.MAIL_SECURE, // true for 465, false for other ports
		auth: {
			user: process.env.MAIL_USERNAME, // generated ethereal user
			pass: process.env.MAIL_PASSWORD // generated ethereal password
		},
		tls: {
			rejectUnauthorized: false
		}
	});

	// setup email data with unicode symbols
	let mailOptions = {
		from: `"${fromName} " <${process.env.MAIL_USERNAME}>`, // sender address
		to: to, // list of receivers
		subject: `${fromName} : ${subject}`, // Subject line
		html: body, // html body
		
		attachments: [
			{   // file on disk as an attachment
				filename: attachment_name,
				path: attachment_path // stream this file
			},
		]
	};

	// send mail with defined transport object
	return await transporter.sendMail(mailOptions)

}