const bcrypt = require('bcryptjs');

const User = require('../models/user');

module.exports = {
    createUser: ({ userInput }) => {
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
                return { ...res._doc, password: null, _id: res.id };
            })
            .catch(err => {
                throw err;
            });
    }
}