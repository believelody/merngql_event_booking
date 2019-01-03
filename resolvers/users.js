const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
    },

    login: async ({email, password}) => {        
        const user = await User.findOne({ email: email });

        if (!user) {
            throw new Error(`User doesn't exist`);
        }
        

        const matching = await bcrypt.compare(password, user.password);
        if (!matching) {
            throw new Error(`Password is incorrect`);
        }

        const token = await jwt.sign({userId: user.id, email: user.email}, 'secret', {expiresIn: '1h'});

        return { userId: user.id, token, tokenExpiration: 1 };
    }
}