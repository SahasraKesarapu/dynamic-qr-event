const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const QRCode = require("qrcode");
const Event = require("./models/Event");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to Mongodb
mongoose.connect('mongodb+srv://kesarapusahasra34:h7LwlDbJsCiuGjZu@myproject-cluster.szkrfkq.mongodb.net/?retryWrites=true&w=majority&appName=myproject-cluster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Create QR and save event

app.post("/create", async (req, res) => {
  try {
    const { title, description, location, date, time } = req.body;
    const qrId = Date.now().toString();

    const event = new Event({ title, description, location, date, time, qrId });
    await event.save();

    const dynamicURL = `https://dynamic-qr-backend.onrender.com/event/${qrId}`;
    const qrImage = await QRCode.toDataURL(dynamicURL);

    res.json({ qrId, qr: qrImage });
  } catch (error) {
    console.error("❌ QR generation failed:", error);
    res.status(500).json({ message: "QR code generation failed" });
  }
});

// Retrieve event details by qrId
app.get("/api/events/:qrId", async (req, res) => {
  try {
    const event = await Event.findOne({ qrId: req.params.qrId });
    if (!event) {
      console.log("❌ Event not found:", req.params.qrId);
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    console.error("❌ Error fetching event:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});