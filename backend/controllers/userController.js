const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

// desc: Register new user
// route: POST /api/users
// access: public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  // Simple validation
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please include all fields')
  }

  // Find if user already exists
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
  })

  // Check new created user
  if (user) {
    // created new user response code
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// desc: Login a user
// route: POST /api/users/login
// access: public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  // Check user and passwords match
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    // unauthorized status code
    res.status(401)
    throw new Error('Invalid credentials!')
  }
})

// desc: Get current user
// route: GET /api/users/me
// access: private
const getMe = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  }
  res.status(200).json(user)
})

// generate jwt token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
}
