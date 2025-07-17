const User = require('./userModel');

// 1. Register User
const registerUser = async (req, res) => {
  try {
    const { uid, email, fullName, username, phoneNumber, address } = req.body;

    // Optional: check if username already exists
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const newUser = new User({ uid, email, fullName, username, phoneNumber, address });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Fetch user by ID
const getUserById = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, getUserById };
