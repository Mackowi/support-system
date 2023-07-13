const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Ticket = require('../models/ticketModel')
const Note = require('../models/noteModel')

// desc: Get notes for a ticket
// route: GET /api/tickets/:ticketId/notes
// access: private
const getNotes = asyncHandler(async (req, res) => {
  // get user using the id in the JWT
  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }
  const tickets = await Ticket.findById(req.params.ticketId)
  if (tickets.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }
  const notes = await Note.find({ ticket: req.params.ticketId })
  res.status(200).json(notes)
})

// desc: Create note for a ticket
// route: POST /api/tickets/:ticketId/notes
// access: private
const createNote = asyncHandler(async (req, res) => {
  const { text } = req.body
  // get user using the id in the JWT
  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }
  const ticket = await Ticket.findById(req.params.ticketId)
  if (ticket.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }
  const note = await Note.create({
    text,
    user,
    ticket,
  })

  res.status(200).json(note)
})

module.exports = {
  getNotes,
  createNote,
}
