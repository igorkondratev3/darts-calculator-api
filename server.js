require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const appRoutes = require('./routes/index.js');

const app = express();
app.disable('x-powered-by');
app.use(express.json());

const corsOptions = {
  origin: process.env.FRONTEND_URI,
  methods: ['DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type'],
}
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
    console.log('connecting to db & listening on port', process.env.PORT)
    });
  })
  .catch((error) => {
    console.log(error)
  });

  app.use(morgan('dev'));

  app.use('/', appRoutes);