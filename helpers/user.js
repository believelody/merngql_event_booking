const User = require('../models/user');

const { events } = require('./event');

exports.user = userId =>
    User
        .findById(userId)
        .then(user => ({
            ...user._doc, 
            _id: user.id, 
            createdEvents: events.bind(this, user._doc.createdEvents)
        }))
        .catch(err => { throw err });