import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendLoginEmail = (name, email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Login Notification",
    text: `Hello ${name}, 🍩\n\nYou’re all logged in! Time to treat yourself to something sweet—or savory. 🍕.\n\nHappy dining,\nTomato 🍅`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export default { sendLoginEmail };
