const Event = require('../models/event');
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

    createEvent: async ({ eventInput }) => {
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
            return transformEvent(res);
        } catch (err) {
            throw err;
        }
    }
}