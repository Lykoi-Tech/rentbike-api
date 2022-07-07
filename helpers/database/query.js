const Mongo = require('../database/db')
const config = require('../../configs/global_config');

const insertOne = async (document, collection) => {
  const db = new Mongo(config.get('/mongoDbUrl'));
  db.setCollection(collection);

  const result = await db.insertOne(document, collection);
  return result;
};

const insertWithIncrement = async (document, collection) => {
  const db = new Mongo(config.get('/mongoDbUrl'));
  db.setCollection(collection);

  const result = await db.insertWithIncrement(document, collection);
  return result;
};

const findAggregate = async (document, collection) => {
  const db = new Mongo(config.get('/mongoDbUrl'));
  db.setCollection(collection);

  const result = await db.findDataByAggregate(document, collection);
  return result;
};

const findMany = async (document, collection) => {
  const db = new Mongo(config.get('/mongoDbUrl'));
  db.setCollection(collection);

  const result = await db.findMany(document, collection);
  return result;
};

const findOne = async (params, collection) => {
  const db = new Mongo(config.get('/mongoDbUrl'));
  db.setCollection(collection);

  const result = await db.findOne(params);
  return result;
};

const upsertOne = async (document, collection, data) => {
  const db = new Mongo(config.get('/mongoDbUrl'));
  db.setCollection(collection);

  const result = await db.upsertOne(document, data);
  return result;
};

const updateOneField = async (parameter, set, collection) => {
  const db = new Mongo(config.get('/mongoDbUrl'));
  db.setCollection(collection);

  const result = await db.updateOneField(parameter, set);
  return result;
};

const findDataPagination = async (sorting, size, page, param, collection) => {
  const db = new Mongo(config.get('/mongoDbUrl'));
  db.setCollection(collection);

  const recordset = await db.findAllDataProduct(sorting, size, page, param);
  return recordset;
};

const countData = async (collection, params) => {
  const db = new Mongo(config.get('/mongoDbUrl'));
  db.setCollection(collection);

  const recordset = await db.countData(params);
  return recordset;
};

const deleteOne = async (parameter, collection) => {
  const db = new Mongo(config.get('/mongoDbUrl'));
  db.setCollection(collection);
  const recordset = await db.deleteOne(parameter);
  return recordset;
};

const deleteMany = async (parameter, collection) => {
  const db = new Mongo(config.get('/mongoDbUrl'));
  db.setCollection(collection);
  const recordset = await db.deleteMany(parameter);
  return recordset;
};

module.exports = {
  insertOne,
  insertWithIncrement,
  findAggregate,
  findMany,
  findOne,
  upsertOne,
  updateOneField,
  findDataPagination,
  countData,
  deleteOne,
  deleteMany
};
