/* eslint-disable max-len */
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    // console.log('Signup body:', req.body);
    // Check if user already exists
    const user = await User.findOne({email: req.body.email});
    if (user) {
      return res.status(400).json({messsage: 'User already exists'});
    }
    // If not, hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // console.log(hashedPassword);
    // Create a new user
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({message: 'User registered successfully'});
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

exports.login = async (req, res) => {
  try {
    // Check if user exists
    // console.log('Login body:', req.body);
    const user = await User.findOne({email: req.body.email}).select('+password');
    // console.log(user);
    if (!user) {
      return res.status(400).json({message: 'Email or password is incorrect'});
    }
    // Check password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({message: 'Email or password is incorrect'});
    }
    // Create and return a token
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
    res.header('Authorization', token).json({message: 'Logged in successfully', token: token});
  } catch (error) {
    res.status(400).json({messsage: error.message});
  }
};
