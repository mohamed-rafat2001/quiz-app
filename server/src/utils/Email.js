import sendEmail from "./sendEmail.js";
import { passwordResetCodeTemplate } from "./emailTemplates.js";

class Email {
	constructor(user, url) {
		this.to = user.email;
		this.name = user.name;
		this.url = url;
		this.from = `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`;
	}

	async send(html, subject) {
		const mailOptions = {
			email: this.to,
			subject,
			html,
		};

		await sendEmail(mailOptions);
	}

	async sendWelcome() {
		// You can add a welcome template later if needed
		await this.send(
			`<h1>Welcome ${this.name}</h1><p>We're glad to have you!</p>`,
			"Welcome to Quiz App!"
		);
	}

	async sendPasswordReset(code) {
		const html = passwordResetCodeTemplate(code, this.name);
		await this.send(html, "Your password reset code (valid for 10 min)");
	}

	async passQuizEmail(message) {
		await this.send(
			`<h1>Quiz Result</h1><p>${message}</p>`,
			"Quiz Result Notification"
		);
	}
}

export default Email;
