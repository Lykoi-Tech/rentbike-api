/* eslint-disable linebreak-style */
const validate = require('validate.js');
const mongoConnection = require('./connection');
const wrapper = require('../utils/wrapper');
const logger = require('../utils/logger');

class DB {
  constructor(config) {
    this.config = config;
  }

  setCollection(collectionName) {
    this.collectionName = collectionName;
  }

  async getDatabase() {
    const config = this.config.replace('//', '');
    /* eslint no-useless-escape: "error" */
    const pattern = new RegExp('/([a-zA-Z0-9-]+)?');
    const dbName = pattern.exec(config);
    return dbName[1];
  }

  async findOne(parameter) {
    const ctx = 'mongodb-findOne';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'error', result, {});
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.findOne(parameter);
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found', 'Please Try Another Input', 404);
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'error', result, {});
      return wrapper.error(`Error Find One Mongo ${err.message}`, `${err.message}`, 409);
    }

  }

  async deleteOne(param) {
    const ctx = 'mongodb-deleteOne';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'error', result, {});
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.deleteOne(param);
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found', 'Please Try Another Input', 404);
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'error', result, {});
      return wrapper.error('Error Mongo', `${err.message}`, 409);
    }
  }

  async deleteMany(param) {
    const ctx = 'mongodb-deleteMany';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'error', result, {});
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.deleteMany(param);
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found', 'Please Try Another Input', 404);
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'error', result, {});
      return wrapper.error('Error Mongo', `${err.message}`, 409);
    }
  }

  async deleteAll() {
    const ctx = 'mongodb-deleteAll';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'error', result, {});
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.remove({});
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found', 'Please Try Another Input', 404);
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'error', result, {});
      return wrapper.error('Error Mongo', `${err.message}`, 409);
    }
  }


  async findMany(parameter) {
    const ctx = 'mongodb-findMany';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'error', result, {});
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.find(parameter).toArray();
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found', 'Please Try Another Input', 404);
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'error', result, {});
      return wrapper.error(`Error Find Many Mongo ${err.message}`, `${err.message}`, 409);
    }
  }

  async findManyWithSort(parameter, sort) {
    const ctx = 'mongodb-findMany';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'error', result, {});
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.find(parameter).sort(sort).toArray();
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found', 'Please Try Another Input', 404);
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'error', result, {});
      return wrapper.error(`Error Find Many Mongo ${err.message}`, `${err.message}`, 409);
    }
  }

  async insertOne(document) {
    const ctx = 'mongodb-insertOne';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'error', result, {});
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.insertOne(document);
      if (recordset.result.n !== 1) {
        return wrapper.error('Internal Server Error', 'Failed Inserting Data to Database', 500);
      }
      return wrapper.data(document, 'created', 201);

    } catch (err) {
      logger.log(ctx, err.message, 'error', result, {});
      return wrapper.error(`Error Insert One Mongo ${err.message}`, `${err.message}`, 409);
    }
  }

  async insertMany(data) {
    const ctx = 'mongodb-insertMany';
    const document = data;
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'error', result, {});
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.insertMany(document);
      if (recordset.result.n < 1) {
        return wrapper.error('Internal Server Error', 'Failed Inserting Data to Database', 500);
      }
      return wrapper.data(document, 'created', 201);

    } catch (err) {
      logger.log(ctx, err.message, 'error', result, {});
      return wrapper.error(`Error Insert Many Mongo ${err.message}`, `${err.message}`, 409);
    }
  }

  async upsertOne(parameter, updateQuery) {
    const ctx = 'mongodb-upsertOne';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'error', result, {});
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const data = await db.update(parameter, updateQuery, { upsert: true });
      if (data.result.nModified >= 0) {
        const { result: { nModified } } = data;
        const recordset = await this.findOne(parameter);
        if (nModified === 0) {
          return wrapper.data(recordset.data, 'created', 201);
        }
        return wrapper.data(recordset.data, 'updated', 204);

      }
      return wrapper.error('Failed upsert data', 'failed', 409);
    } catch (err) {
      logger.log(ctx, err.message, 'error', result, {});
      return wrapper.error(`Error Upsert Mongo ${err.message}`, `${err.message}`, 409);
    }
  }

  async findAllData(fieldName, row, page, param) {
    const ctx = 'mongodb-findAllData';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'error', result, {});
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const parameterSort = fieldName;
      const parameterPage = row * (page - 1);

      const recordset = await db.find(param).sort(parameterSort).limit(row).skip(parameterPage)
        .toArray();
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found', 'Please Try Another Input', 404);
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'Error get data in mongodb');
      return wrapper.error('Error Mongo', `${err.message}`, 409);
    }
  }

  async findAllDataProduct(fieldName, row, page, param) {
    const ctx = 'mongodb-findAllData';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'error', result, {});
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const parameterSort = fieldName;
      const parameterPage = row * (page - 1);
      const recordset = await db.find(param).collation({ locale: 'en' }).sort(parameterSort).limit(row).skip(parameterPage)
        .toArray();
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found', 'Please Try Another Input', 404);
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'error', result, {});
      return wrapper.error('Error Mongo', `${err.message}`, 409);
    }
  }

  async findLastId(sort) {
    const ctx = 'mongodb-findLastId';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'error', result, {});
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.find({}).project({_id:0}).sort(sort).limit(1).toArray();
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found', 'Please Try Another Input', 404);
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'error', result, {});
      return wrapper.error('Error Mongo', `${err.message}`, 409);
    }
  }

  async findAllDatas(fieldName, row, page, param) {
    const ctx = 'mongodb-findAllData';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'error', result, {});
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const parameterPage = row * (page - 1);
      const recordset = await db.aggregate([
        { $match: param },
        { '$sort': { productName: 1, description: -1, feature: 1 } },
        {
          '$facet': {
            data: [{ $skip: parameterPage }, { $limit: row }] // add projection here wish you re-shape the docs
          }
        }
      ]).toArray();
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found', 'Please Try Another Input', 404);
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'error', result, {});
      return wrapper.error('Error Mongo', `${err.message}`, 409);
    }
  }

  async countData(param) {
    const ctx = 'mongodb-countData';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'error', result, {});
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.countDocuments(param);
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found', 'Please Try Another Input', 404);
      }
      return wrapper.data(recordset);

    } catch (err) {
      logger.log(ctx, err.message, 'Error count data in mongodb');
      return wrapper.error('Error Mongo', `${err.message}`, 409);
    }
  }

  async updateOneField(parameter, set) {
    const ctx = 'mongodb-updateOneField';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'error', result, {});
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const data = await db.update(parameter, { $set: set}, {upsert:true});
      if (data.result.nModified >= 0) {
        const { result: { nModified } } = data;
        const recordset = await this.findOne(parameter);
        if (nModified === 0) {
          return wrapper.data(recordset.data, 'created', 201);
        }
        return wrapper.data(recordset.data, 'updated', 204);

      }
      return wrapper.error('Failed upsert data', 'failed', 409);
    } catch (err) {
      logger.log(ctx, err.message, 'error', result, {});
      return wrapper.error(`Error Upsert Mongo ${err.message}`, `${err.message}`, 409);
    }

  }

  async insertWithIncrement(document, collection, idName){
    const ctx = 'mongodb-insertOne';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'error', result, {});
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const incrementid = await this.increment(collection);
      const param = {
        ...document,
      };
      idName ? param[idName] = incrementid : param.id = incrementid;
      const recordset = await db.insertOne(param);
      if (recordset.result.n !== 1) {
        return wrapper.error('Failed Inserting Data to Database');
      }
      return wrapper.data(param);

    } catch (err) {
      logger.log(ctx, err.message, 'error', result, {});
      return wrapper.error(`Error Insert One Mongo ${err.message}`);
    }
  }

  async increment(collection) {
    const ctx = 'mongodb-increment';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'error', result, {});
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection('counter');
      const findCounter = await db.findOne({_id: collection});
      if(!findCounter){
        const param = {
          _id: collection,
          seq: 1
        };
        await db.insertOne(param);
      }
      const increment = await db.findOneAndUpdate(
        { _id: collection },
        { $inc: { seq: 1 } },
      );
      return increment.value.seq;

    } catch (err) {
      logger.log(ctx, err.message, 'error', result, {});
      return wrapper.error(`Error Insert One Mongo ${err.message}`);
    }
  }

  async findDataByAggregate(pipeline) {
    const ctx = 'mongodb-findDataByAggregate';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'error', result, {});
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const options = {
        allowDiskUse: false
      };

      const recordset = await db.aggregate(pipeline, options).toArray();
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found', 'Please Try Another Input', 404);
      }
      return wrapper.data(recordset);
    } catch (err) {
      logger.log(ctx, err.message, 'error', result, {});
      return wrapper.error('Error Mongo', `${err.message}`, 409);
    }
  }


  async findDistinctData(fieldName, param) {
    const ctx = 'mongodb-findDistinct';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'error', result, {});
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.distinct(fieldName, param);
      if (validate.isEmpty(recordset)) {
        return wrapper.error('Data Not Found', 'Please Try Another Input', 404);
      }
      return wrapper.data(recordset);
    } catch (err) {
      logger.log(ctx, err.message, 'error', result, {});
      return wrapper.error('Error Mongo', `${err.message}`, 409);
    }
  }
}

module.exports = DB;
