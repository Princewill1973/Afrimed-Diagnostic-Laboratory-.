const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (your HTML/CSS/JS in public folder)
app.use(express.static(path.join(__dirname, "public")));

//Serve index.html at the root"/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle form submission
app.post("/send", async (req, res) => {
  const { fullName, email, phone, date, service, message } = req.body;

  // Setup email transporter (using Gmail example)
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,      // your Gmail address
      pass: process.env.MY_PASSWORD    // your Gmail app password
    }
  });

  // Email content
  let mailOptions = {
    from: `"Afrimed Diagnostic Laboratory Website" <${process.env.MY_EMAIL}>`,
    to: process.env.MY_EMAIL, // where you want to receive bookings
    subject: "New Booking Request",
    text: `
      Name: ${fullName}
      Email: ${email}
      Phone: ${phone}
      Date: ${date}
      Service: ${service}
      Notes: ${message || "None"}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("✅ Booking request sent successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Failed to send booking request.");
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
