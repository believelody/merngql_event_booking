const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }

        type RootMutation {
            createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return ['test', 'test1', 'test2'];
        },
        createEvent: (args) => {
            const { name } = args;
            return name;
        }
    },
    graphiql: true
}));

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));