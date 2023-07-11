const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const PORT = process.env.PORT || 5000
const { errorHandler } = require('./middleware/errorMiddleware')
const userRoutes = require('./routes/userRoutes')
const connectDB = require('./config/db')

// connect to db
connectDB()

const app = express()

//json and urlencoded parsers
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the support' })
})

app.use('/api/users', userRoutes)

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
