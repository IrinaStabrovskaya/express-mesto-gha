const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes/index');

const app = express();

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '648c0b166cd492f441238919',
  };

  next();
});

app.use(routes);
app.listen(PORT);
