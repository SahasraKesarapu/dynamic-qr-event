const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const QRCode = require('qrcode');

// POST create and return QR
router.post('/', async (req, res) => {
    const { title, description, location, date, time } = req.body;
    const qrId = Date.now().toString();
    const event = new Event({ title, description, location, date, time, qrId });
    await event.save();

    const dynamicURL = `http://192.168.31.13:3000/event/${qrId}`; // Replace with your IP
    const qrImage = await QRCode.toDataURL(dynamicURL);

    res.json({ qrId, qrImage });
});

// GET event details
router.get('/:qrId', async (req, res) => {
    const event = await Event.findOne({ qrId: req.params.qrId });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
});

module.exports = router;