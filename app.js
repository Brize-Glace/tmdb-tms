const express = require('express');
const app = express();
const port = 3000;
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());
app.use(express.static('public'));

const filmRoutes = require('./routes/film.routes');

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use('/', filmRoutes);

app.set('view engine', 'ejs');

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = app;