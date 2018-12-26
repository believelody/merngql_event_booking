const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            creator: User!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event
                .find()
                .then(events => events.map(event => ({ ...event._doc, _id: event.id })))
                .catch(err => {
                    console.error(err);
                    throw err;
                });
        },

        createEvent: ({eventInput}) => {
            const { title, description, price, date } = eventInput;
            const event = new Event({
                title,
                description,
                price: +price,
                date: new Date(date),
                creator: "5c2382189b11f62caf5d0f5d"
            });

            return User.findById("5c2382189b11f62caf5d0f5d")
                .then(user => {
                    if (!user) {
                        throw new Error('User not found.');
                    }
                    user.createdEvents.push(event);
                    return user.save();
                })
                .then(res => event.save())
                .then(res => ({ ...res._doc, _id: res.id }))
                .catch(err => {
                    throw err;
                });
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
    },
    graphiql: true
}));

mongoose
    .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@merngql-event-booking-full5.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
    .then(() =>{
        app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
    })
    .catch(err => console.error(err));