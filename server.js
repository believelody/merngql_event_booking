const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const isAuth = require('./middleware/is-auth');

const schema = require('./schema');
const resolvers = require('./resolvers');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(isAuth);
app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true
}));

mongoose
    .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@merngql-event-booking-full5.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, {useNewUrlParser: true})
    .then(() =>{
        app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
    })
    .catch(err => console.error(err));