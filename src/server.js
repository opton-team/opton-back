const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const targetAddress = process.env.TARGET_EMAIL_ADDRESS;
const address = process.env.EMAIL_ADDRESS;
const pass = process.env.EMAIL_PASSWORD;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.listen(5000, () => console.log("Server Running"));

const contactEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: address,
    pass: pass,
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

router.post("/contactsend", (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  let telephone = req.body.telephone;
  const content = req.body.content;
  const topic = req.body.topic;

  if (telephone === "") {
    telephone = "BRAK";
  }

  const mail = {
    from: name + " " + surname,
    to: targetAddress,
    subject: `Zapytanie: ${topic} - ${name} ${surname}`,
    html: `<p>Imię i nazwisko: ${name} ${surname}</p>
             <p>Email: ${email}</p>
             <p>Numer kontaktowy: ${telephone}</p>
             <p>Wiadomość: ${content}</p>`,
  };

  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json({ status: "ERROR" });
    } else {
      res.json({ status: "OK" });
    }
  });
});
