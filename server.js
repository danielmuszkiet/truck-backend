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

  let htmlMail = `  
    <div role="article" aria-roledescription="email" lang="en"
      style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#1e1e1e;">
      <table role="presentation" style="width: 100%; border: none;border-spacing: 0;">
        <tr>
          <td align="center" style="padding: 0;">
        <tr>
          <td style="padding:40px 30px 30px 30px;text-align:center;font-size:24px;font-weight:bold;">
            <a href="https://truck-pdvk.onrender.com" style="text-decoration:none;"><img
                src="https://truck-pdvk.onrender.com/imgs/logo.png" alt="Logo"></a>
          </td>
        </tr>
        <tr>
  
          <td style="padding:30px;background-color:#ffffff;">
            <h1
              style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;">
              Hey Du 😁</h1>
            <p style="margin:0;">Wir haben deine Anfrage erhalten und bearbeiten diese.</p>
            <p style="margin: 0;">Wir werden uns bei dir melden wenn alles passt 👍</p>
  
            <p style="margin: 25px 0 0 0;"><a href="http://www.example.com/"
              style="color:#e50d70;text-decoration:underline;">Dein Profil</a>
            </p>
          </td>
        </tr>
  
  
  
        <!-- Left & Right -->
        <tr>
          <td style="padding:35px 30px 35px 30px;font-size:0;background-color:#ffffff;border-top: 5px dotted;">
            <div class="col-sml"
              style="display:inline-block;width:100%;max-width:145px;vertical-align:top;text-align:left;font-family:Arial,sans-serif;font-size:16px;color:#363636;">
              <p style="margin: 0;">Abholung: </p>
              <p>Rückgabe: </p>
              <p>Jeep Typ: </p>
              <p>Erfahrung: </p>
              <p>Telefonnummer: </p>
            </div>
  
            <div class="col-lge"
              style="display:inline-block;width:100%;max-width:395px;vertical-align:top;color: black; font-family:Arial,sans-serif;font-size:16px;font-weight: bold;color:#363636;">
              <p style="margin: 0;">${from}</p>
              <p>${to}</p>
              <p>${jeepType}</p>
              <p>${exp}</p>
              <p>${tel}}</p>
            </div>
          </td>
        </tr>
        <tr>
  
          <td style="padding:30px;text-align:center;font-size:12px;background-color:#1e1e1e;color:#cccccc;">
  
            <p style="margin: 8px; font-size: 25px;">
              <a class="fa fa-instagram" alt="Insta" style="margin: 0 4px; color: #cccccc;text-decoration:none;" href="#"
                target="_blank" rel="noopener noreferrer"></a>
              <a class="fa fa-youtube" style="margin: 0 4px; color: #cccccc;text-decoration:none;" href="#"
                target="_blank" rel="noopener noreferrer"></a>
              <a class="fa fa-facebook" style="margin: 0 4px; color: #cccccc;text-decoration:none;" href="#"
                target="_blank" rel="noopener noreferrer"></a>
            </p>
            <p style="margin:0;font-size:14px;line-height:20px;">&reg; Someone, Somewhere 2024<br><a class="unsub"
                href="http://www.example.com/" style="color:#cccccc;text-decoration:underline;">Trailex</a></p>
          </td>
  
        </tr>
  
      </table>
  
      </td>
      </tr>
      </table>
    </div>`;
  // Setup email data
  let mailOptions = {
    from: process.env.MAIL,
    to: email,
    subject: "Bestätigung Ihrer Anfrage",
    text: htmlMail,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error occurred:", error);
      let mailOptions2 = {
        from: process.env.MAIL,
        to: process.env.MAIL,
        subject: "Anfrage",
        text: `Von: ${from}\n"Bis: ${to}\nTyp: ${jeepType}\nErfarhung: ${exp}\nTel.: ${tel}\nBereits Kunde: ${
          yesno == "1" ? "Ja" : "Nein"
        }\nNachricht:\n${msg}\n`,
      };

      // Send the email
      transporter.sendMail(mailOptions2, (error, info) => {
        if (error) {
          console.error("Error occurred:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
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
