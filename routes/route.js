const router = require('express').Router();
const apiHandlers = require('../modules/api_handler');

router.get('/', function (_, res) {
  res.json({
    status: 200,
    message: 'Soerat Kabar API v1.0 successfull running'
  });
});

router.post('/users/register', apiHandlers.registerUser);

module.exports = router;
