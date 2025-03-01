const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        type: String
    },
    databases: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Exercise'
        }
    ],
});

module.exports = mongoose.model("User", userSchema);
