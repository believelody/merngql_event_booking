const bcrypt = require('bcryptjs');

const Event = require('../models/event');
const User = require('../models/user');

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
    }
}