const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
const PORT = process.env.PORT || 5000;

const events = [

]

app.use(bodyParser.json());
app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String
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
            return events;
        },
        createEvent: ({eventInput}) => {
            const { title, description, price } = eventInput;
            const event = {
                _id: Math.random().toString(),
                title,
                description,
                price: +price,
                date: new Date().toISOString()
            }

            events.push(event);
            return event;
        }
    },
    graphiql: true
}));

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));