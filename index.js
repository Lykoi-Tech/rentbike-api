const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes/route');
const app = express();
const config = require('./configs/global_config');
const mongoConnectionPooling = require('./helpers/database/connection');

dotenv.config();
app.use(express.json());
app.use(routes);
mongoConnectionPooling.init();

app.listen(config.get('/port'), function () {
  console.log(`Server listening on port ${config.get('/port')}`);
  console.log('Database connected successfully!');
});