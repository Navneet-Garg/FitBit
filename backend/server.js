// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const exerciseRoutes = require("./Routes/exerciseRoutes");
// const User = require("./Model/User");

// const app = express();

// app.use(cors());
// app.use(express.json());

// const PORT = process.env.PORT || 5012;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// mongoose.connect('mongodb://localhost:27017/fitbit')
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((error) => console.error('MongoDB connection error:', error));

  
// app.use('/api', exerciseRoutes);


// app.post("/api/auth/google", async (req, res) => {
//   const { googleId, name, email, picture, accessToken } = req.body;

//   let user = await User.findOne({ googleId });
//   if (!user) {
//       user = new User({ googleId, name, email, picture, accessToken });
//       await user.save();
//   } else {
//       user.accessToken = accessToken;
//       await user.save();
//   }

//   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
//   res.json({ user, token });
// });

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const exerciseRoutes = require("./Routes/exerciseRoutes");
const User = require("./Model/User");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5012;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitbit')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes


// Google OAuth Authentication
app.post("/api/auth/google", async (req, res) => {
  const {name, email, avatar, accessToken } = req.body;

  try {
    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({ name, email, avatar, accessToken });
      await user.save();
    } else {
      user.accessToken = accessToken;
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ user, token });
  } catch (error) {
    console.error("Google OAuth Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.use('/api', exerciseRoutes);

module.exports = app;
