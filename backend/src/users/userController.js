const User = require('./userModel');

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

module.exports = registerUser;
