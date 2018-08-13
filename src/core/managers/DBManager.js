/**
 * @name Taggy#DBManager
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

// Dependencies
const mongoose = require('mongoose');
const { print } = require('../../util/Util');
const { cyan, green, red } = require('../../deps/Colors');

// Declarations
const schemas = require('../structures/DBSchemas.js');

class DBManager {
  constructor(uri = 'mongodb://localhost:27017/Taggy') {
    this.uri = uri;
  }

  launch(uri = this.uri) {
    mongoose.Promise = global.Promise;
    mongoose.schemas = schemas;

    print(1, `[${cyan('Master')}] >> Connecting to ${green(uri)}`);
    mongoose.connect(uri, { useNewUrlParser: true });

    mongoose.connection.on('connected', () => print(1, `[${cyan('Master')}] >> Connected to ${green(uri)}`));
    mongoose.connection.on('error', (err) => {
      print(1, `[${cyan('Master')}] !! ConnectionError - ${red(`${err.message}\n${err.stack}`)}`);
      process.exit(500);
  });
    this.db = mongoose;
    return mongoose;
  }

  destroy() {
    let trace = { success: false };
    print(1, `[${cyan('Master')}] >> Disconnecting from database`);
    try {
      mongoose.connection.close(() => {
        trace.success = true;
      });
    } catch(err) {
      trace.success = false;
      trace.err = {
        code: err.code,
        message: err.message,
        stack: err.stack
      };
    }
    print(1, `[${cyan('Master')}] >> Destroy callback - ${red(trace)}`);
  }
};

module.exports = DBManager;