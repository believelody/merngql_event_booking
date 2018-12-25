const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.get('/', (req, res, next) => {
    res.send('Yes we can');
})

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));