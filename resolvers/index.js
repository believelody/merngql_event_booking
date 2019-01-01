const bcrypt = require('bcryptjs');

const Event = require('../models/event');
const User = require('../models/user');
const Booking = require('../models/booking');

const events = async eventsId => {
    try {
        const events = await Event.find({_id: {$in: eventsId}});

        return events.map(event => ({
            ...event._doc, 
            _id: event.id, 
            creator: user.bind(this, event._doc.creator),
            date: new Date(event._doc.date).toISOString()
        }))
    } catch (err) {
        throw err;
    }
}

const singleEvent = eventId =>
    Event
        .findById(eventId)
        .then(event => ({
            ...event._doc, 
            _id: event.id, 
            creator: user.bind(this, event._doc.creator),
            date: new Date(event._doc.date).toISOString()
        }))
        .catch(err => { throw err });

const user = userId => 
    User
        .findById(userId)
        .then(user => ({
            ...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents)
        }))
        .catch(err => { throw err });

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();

            return events.map(event => ({
                ...event._doc, 
                _id: event.id,
                creator: user.bind(this, event._doc.creator),
                date: new Date(event._doc.date).toISOString()
            }));
        } catch (err) {
            throw err;
        }
    },

    bookings: async () => {
        try {
            const bookings = await Booking.find();

            return bookings.map(booking => ({
                ...booking._doc,
                _id: booking.id,
                user: user.bind(this, booking._doc.user),
                event: singleEvent.bind(this, booking._doc.event),
                createdAt: new Date(booking._doc.createdAt).toISOString(),
                updatedAt: new Date(booking._doc.updatedAt).toISOString()
            }));
        } catch (error) {
            throw error;
        }
    },

    createEvent: async ({eventInput}) => {
        const { title, description, price, date } = eventInput;
        const event = new Event({
            title,
            description,
            price: +price,
            date: new Date(date),
            creator: "5c2382189b11f62caf5d0f5d"
        });

        try {
            const userSaved = await User.findById("5c2382189b11f62caf5d0f5d");
            if (!userSaved) {
                throw new Error('User not found.');
            }
            userSaved.createdEvents.push(event);
            await userSaved.save();
            const res = await event.save();
            return { 
                ...res._doc, 
                _id: res.id, 
                creator: user.bind(this, res._doc.creator),
                date: new Date(event._doc.date).toISOString()
            };
        } catch (err) {
            throw err;
        }
    },

    createUser: ({userInput}) => {
        const { email, password } = userInput;

        return User
            .findOne({ email })
            .then(user => {
                if (user) {
                    throw new Error('User already exists.');
                }
                else {
                    return bcrypt.hash(password, 12);
                }
            })
            .then(hashedPwd => {

                const user = new User({ email, password: hashedPwd });

                return user.save();
            })
            .then(res => {
                // Put "null" on password to unable retrieving value
                return { ...res._doc, password: null, _id: res._doc.id };
            })
            .catch(err => {
                throw err;
            });
    },

    bookEvent: async args => {
        const { eventId } = args;
        const event = await Event.findOne({_id: eventId});
        const booking = new Booking({
            user: "5c2ba516816c9b0e29b30236",
            event
        });

        const res = await booking.save();
        return {
            ...res._doc,
            event: singleEvent.bind(this, res._doc.event.id),
            user: user.bind(this, "5c2ba516816c9b0e29b30236"),
            _id: res.id,
            createdAt: new Date(res._doc.createdAt).toISOString(),
            updatedAt: new Date(res._doc.updatedAt).toISOString()
        }
    },

    cancelBooking: async args => {
        const { bookingId } = args;

        try {
            const booking = await Booking.findById(bookingId).populate('event');
            const event = { 
                ...booking.event._doc, 
                _id: booking.event.id, 
                creator: user.bind(this, booking.event._doc.creator)
            };
            await Booking.findByIdAndDelete(bookingId);
            return event;

        } catch (error) {
            throw error;
        }
    }
}