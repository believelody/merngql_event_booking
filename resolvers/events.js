const Event = require('../models/event');
const User = require('../models/user');
const { transformEvent } = require('../helpers/event');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();

            return events.map(event => transformEvent(event));
        } catch (err) {
            throw err;
        }
    },

    createEvent: async ({ eventInput }, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }      
        
        const { title, description, price, date } = eventInput;
        const event = new Event({
            title,
            description,
            price: +price,
            date: new Date(date),
            creator: req.userId
        });
        
        try {
            const creator = await User.findById(req.userId);
            
            if (!creator) {
                throw new Error('User not found.');
            }
            creator.createdEvents.push(event);
            await creator.save();
            const res = await event.save();
            return transformEvent(res);
        } catch (err) {
            throw err;
        }
    }
}