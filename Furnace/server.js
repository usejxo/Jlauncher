const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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

// Function to authenticate user
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Sign up route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    const token = jwt.sign({ username }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
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

  const token = jwt.sign({ username }, process.env.JWT_SECRET);
  res.json({ token });
});

// Get user library
app.get('/furnace-data', authenticateToken, async (req, res) => {
  const userLibrary = await Library.findOne({ username: req.user.username }) || { mods: [] };
  res.json(userLibrary.mods);
});

// Add mod to user library
app.post('/add-mod', authenticateToken, async (req, res) => {
  const { modName } = req.body;
  let userLibrary = await Library.findOne({ username: req.user.username });

  if (!userLibrary) {
    userLibrary = new Library({ username: req.user.username, mods: [] });
  }

  if (!userLibrary.mods.includes(modName)) {
    userLibrary.mods.push(modName);
    await userLibrary.save();
    res.sendStatus(200);
  } else {
    res.status(400).json({ error: 'Mod already in library' });
  }
});

// Remove mod from user library
app.post('/remove-mod', authenticateToken, async (req, res) => {
  const { modName } = req.body;
  const userLibrary = await Library.findOne({ username: req.user.username });

  if (!userLibrary) {
    return res.status(400).json({ error: 'Library does not exist' });
  }

  userLibrary.mods = userLibrary.mods.filter(mod => mod !== modName);
  await userLibrary.save();
  res.sendStatus(200);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
