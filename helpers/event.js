const Event = require('../models/event');

const { user } = require('./user');
const { dateToString } = require('./date');

exports.events = async eventsId => {
    try {
        const events = await Event.find({ _id: { $in: eventsId } });

        return events.map(event => transformEvent(event))
    } catch (err) {
        throw err;
    }
}

exports.singleEvent = eventId =>
    Event
        .findById(eventId)
        .then(event => transformEvent(event))
        .catch(err => { throw err });

exports.transformEvent = event => ({
    ...event._doc,
    _id: event.id,
    creator: user.bind(this, event._doc.creator),
    date: dateToString(event._doc.date)
});