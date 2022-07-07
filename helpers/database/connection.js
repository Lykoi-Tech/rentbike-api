
const Mongo = require('mongodb').MongoClient;
const validate = require('validate.js');
const wrapper = require('../utils/wrapper');
const config = require('../../configs/global_config');
const logger = require('../utils/logger');

const connectionPool = [];
const connection = () => {
  const connectionState = { index: null, config: '', db: null };
  return connectionState;
};

const createConnection = async (config) => {
  const options = {
    poolSize: 50,
    keepAlive: 15000,
    socketTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  try {
    const connection = await Mongo.connect(config, options);
    return wrapper.data(connection);
  } catch (err) {
    logger.log('connection-createConnection', err, 'error', config, {});
    return wrapper.error(err, err.message, 503);
  }
};

const addConnectionPool = (url, index) => {
  const connectionMongo = connection();
  connectionMongo.index = index;
  connectionMongo.config = url;
  connectionPool.push(connectionMongo);
};

const createConnectionPool = async () => {
  connectionPool.map(async (currentConnection, index) => {
    const result = await createConnection(currentConnection.config);
    if (result.err) {
      connectionPool[index].db = currentConnection;
    } else {
      connectionPool[index].db = result.data;
    }
  });
};

const init = () => {
  addConnectionPool(config.get('/mongoDbUrl'), 0);
  createConnectionPool();
};

const ifExistConnection = async (config) => {
  let state = {};
  connectionPool.map((currentConnection) => {
    if (currentConnection.config === config) {
      state = currentConnection;
    }
    return state;
  });
  if (validate.isEmpty(state)) {
    return wrapper.error('Connection Not Exist', 'Connection Must be Created Before', 404);
  }
  return wrapper.data(state);

};

const isConnected = async (state) => {
  const connection = state.db;
  if (!connection.isConnected()) {
    return wrapper.error('Connection Not Found', 'Connection Must be Created Before', 404, state);
  }
  return wrapper.data(state);
};

const getConnection = async (config) => {
  let connectionIndex;
  const checkConnection = async () => {
    const result = await ifExistConnection(config);
    if (result.err) {
      return result;
    }
    const connection = await isConnected(result.data);
    connectionIndex = result.data.index;
    return connection;

  };
  const result = await checkConnection();
  if (result.err) {
    const state = await createConnection(config);
    if (state.err) {
      return wrapper.data(connectionPool[connectionIndex]);
    }
    connectionPool[connectionIndex].db = state.data;
    return wrapper.data(connectionPool[connectionIndex]);

  }
  return result;

};

const closeConnection = async(config) => {
  const conn = await getConnection(config);
  if(conn.data === null) {
    return true;
  }
  const closeConn = new Promise((resolve, reject) => {
    conn.data.db.close((err) => {
      if (err) {
        logger.log('mongodb-closeConnection', `fail to close connection to ${JSON.stringify(config)}`, 'error', config, {});
        reject(err);
      }
      logger.log('mongodb-closeConnection', `success to close connection to ${JSON.stringify(config)}`, 'info', config, {});
      resolve(true);
    });
  });
  return Promise.resolve(closeConn)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};


const release = async() => {
  const closeMONGOCatalog = await closeConnection(config.get('/mongoDbUrl'));
  if(closeMONGOCatalog) {
    return true;
  }
  return false;
};


module.exports = {
  init,
  getConnection,
  release
};
