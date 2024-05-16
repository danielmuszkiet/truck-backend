import express, { json, response } from "express";
import { createTransport } from "nodemailer";
import cors from "cors";

const app = express();
const PORT = process.env.PORT;
console.log(PORT);

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cors());
// Create a Nodemailer transporter using SMTP
let transporter = createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS,
  },
});


// POST route to send email
app.post("/send-email", (req, res) => {
  // Extract data from the request body
  const { to, email, msg, from, tel, exp, jeepType, yesno } = req.body;
  console.log(req.body, process.env.PASS, process.env.MAIL);

  // Setup email data
  let mailOptions = {
    from: process.env.MAIL,
    to: email,
    subject: "Bestätigung Ihrer Anfrage",
    text: `${from}\n${to}\n${jeepType}\n${exp}\n${tel}\n${yesno}\n${msg}\n`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error occurred:", error);
      res.status(500).send("Failed to send email");
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});


app.get("/", (req, res) => {
  res.status(200).send("Server Running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
