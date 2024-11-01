const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Define Library Schema
const librarySchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  mods: { type: [String], default: [] },
});

// Create User and Library Models
const User = mongoose.model('User', userSchema);
const Library = mongoose.model('Library', librarySchema);

// Sign up route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.sendStatus(201); // Created
  } catch (error) {
    console.error("Signup error:", error); // Log error
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || user.password !== password) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  res.sendStatus(200); // OK
});

// Get user library
app.get('/furnace-data', async (req, res) => {
  const { username } = req.query; // Retrieve username from query
  try {
    const userLibrary = await Library.findOne({ username }) || { mods: [] };
    res.json(userLibrary.mods);
  } catch (error) {
    console.error("Error fetching library data:", error); // Log error
    res.sendStatus(500); // Internal Server Error
  }
});

// Add mod to user library
app.post('/add-mod', async (req, res) => {
  const { username, modName } = req.body; // Retrieve username and modName from body
  try {
    let userLibrary = await Library.findOne({ username });

    if (!userLibrary) {
      userLibrary = new Library({ username, mods: [] });
    }

    if (!userLibrary.mods.includes(modName)) {
      userLibrary.mods.push(modName);
      await userLibrary.save();
      res.sendStatus(200);
    } else {
      res.status(400).json({ error: 'Mod already in library' });
    }
  } catch (error) {
    console.error("Error adding mod:", error); // Log error
    res.sendStatus(500); // Internal Server Error
  }
});

// Remove mod from user library
app.post('/remove-mod', async (req, res) => {
  const { username, modName } = req.body; // Retrieve username and modName from body
  try {
    const userLibrary = await Library.findOne({ username });

    if (!userLibrary) {
      return res.status(400).json({ error: 'Library does not exist' });
    }

    userLibrary.mods = userLibrary.mods.filter(mod => mod !== modName);
    await userLibrary.save();
    res.sendStatus(200);
  } catch (error) {
    console.error("Error removing mod:", error); // Log error
    res.sendStatus(500); // Internal Server Error
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
