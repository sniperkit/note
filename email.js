
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
	host:'smtp.exmail.qq.com',
	port: 587,
	secure: false,
	auth: {
		user: 'noreply@mail.keepwork.com',
		pass: 'M3Hbhq6KAZzagFP4',
	}
});

const from = "noreply@mail.keepwork.com";


transporter.verify(function(error, success) {
	if (error) {
		console.log(error);
	} else {
		console.log("server is ready to take our messages");
	}
})


transporter.sendMail({
	from: from,
	to: '765485868@qq.com',
	subject: "Message Title",
	html: "<div> hello world </div>",
}, function(err) {
	console.log(err);
});
