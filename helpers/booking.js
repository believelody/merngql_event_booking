const { singleEvent } = require('./event');
const { user } = require('./user');
const { dateToString } = require('./date');

exports.transformBooking = booking => ({
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
});