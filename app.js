const express = require('express');
const mongoose = require('mongoose');
// const auth = require('./middlewares/auth');

const routes = require('./routes/index');

const app = express();

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.use(express.json());

app.use(routes);
// app.use(auth);
app.listen(PORT);
