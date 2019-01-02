const userResolver = require('./users');
const eventResolver = require('./events');
const bookingResolver = require('./bookings');

module.exports = {
    ...userResolver,
    ...eventResolver,
    ...bookingResolver
}