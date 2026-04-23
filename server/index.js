require('dotenv').config();
const bodyparser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const { connect } = require('./db');
const router = require("./routes/index");

const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyparser.json({ limit: '50mb' }));
app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.get('/', (req, res) => {
    res.send("Hello World");
});

app.use('/api', router);

connect();


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});