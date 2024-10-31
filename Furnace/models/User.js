const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    data: {
        furnace: {
            mods: [{ type: String }]  // Array to hold mod names
        }
    }
});

module.exports = mongoose.model('User', userSchema);
