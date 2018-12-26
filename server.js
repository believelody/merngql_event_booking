const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const Event = require('./models/event');

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
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
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
                date: new Date(date)
            });

            return event
                .save()
                .then(res => {
                    return {...res._doc};
                })
                .catch(err => {
                    console.error(err);
                    throw err;
                });

            return event;
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