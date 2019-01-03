const Booking = require('../models/booking');
const Event = require('../models/event');

const { transformBooking } = require('../helpers/booking');
const { transformEvent } = require('../helpers/event');

module.exports = {
    bookings: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }

        try {
            const bookings = await Booking.find();

            return bookings.map(booking => transformBooking(booking));
        } catch (error) {
            throw error;
        }
    },

    bookEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }

        const { eventId } = args;
        const event = await Event.findOne({ _id: eventId });
        const booking = new Booking({
            user: "5c2ba516816c9b0e29b30236",
            event
        });

        const res = await booking.save();
        return transformBooking(res);
    },

    cancelBooking: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        
        const { bookingId } = args;

        try {
            const booking = await Booking.findById(bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.findByIdAndDelete(bookingId);
            return event;

        } catch (error) {
            throw error;
        }
    }
}