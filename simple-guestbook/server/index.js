require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas using environment variables
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('Error: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 5000,
})

  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch(err => console.log('DB Connection Error:', err));

const MessageSchema = new mongoose.Schema({
  name: String,
  message: String
});
const Message = mongoose.model('Message', MessageSchema);

app.post('/api/messages', async (req, res) => {
  try {
    const newMessage = new Message({
      name: req.body.name,
      message: req.body.message
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
