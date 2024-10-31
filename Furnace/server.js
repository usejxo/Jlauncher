const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// User Registration
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).send('User created');
    } catch (error) {
        res.status(400).send('Error creating user');
    }
});

// User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).send('User not found');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(403).send('Invalid credentials');

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET);
    res.json({ token });
});

// Update Furnace Mods
app.post('/update-furnace-mods', authenticateToken, async (req, res) => {
    const { mods } = req.body;  // Expected to be an array of mod names

    try {
        await User.updateOne(
            { _id: req.user.id },
            { $set: { 'data.furnace.mods': mods } }
        );
        res.send('Furnace mods updated successfully');
    } catch (error) {
        res.status(400).send('Error updating mods');
    }
});

// Get User's Furnace Data
app.get('/furnace-data', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('data.furnace');
        if (!user) return res.status(404).send('User not found');

        res.json(user.data.furnace);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

