const bcrypt = require('bcryptjs');
const wrapper = require('../../helpers/utils/wrapper');
const jwt = require('jsonwebtoken');
const config = require('../../configs/global_config');
const mongodb = require('../../helpers/database/query');
const userCollection = config.get('/mongoDbCollections').users;

const registerUser = async (payload) => {
  const query = await mongodb.insertOne(payload, userCollection);
  return wrapper.data(query, 'Success Register User', 200);
};

const getAllUsers = async (payload) => {
  const query = await mongodb.findMany({}, userCollection);
  let result = [];

  query.data.map((item) => {
    result.push({
      username: item.username,
      email: item.email
    });
  });

  return wrapper.data(result, 'success get all users', 200);
};

module.exports = {
  registerUser,
  getAllUsers
}