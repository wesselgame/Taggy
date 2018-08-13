/**
 * @name Taggy#Main
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0
 * @version 0.1.0
 * @description Taggy is just another discord bot with tags, nothing more
 */
console.clear();
require('./deps/Array');

const { print: print } = require('./util/Util');
const { Client: Client } = require('./core');
const { safeLoad: safeLoad } = require('js-yaml');
const { readFileSync: readFileSync } = require('fs');
const { red: red, yellow: yellow, cyan: cyan } = require('./deps/Colors');

const _ico = safeLoad(readFileSync('assets/yml/emojis.yml'));
const _col = safeLoad(readFileSync('assets/yml/colors.yml'));
const _conf = safeLoad(readFileSync('application.yml', 'utf8'));

const client = new Client({
    ua: _conf.ua,
    db: _conf.db,
    colors: _col,
    emojis: _ico,
    config: _conf,
    package: require('../package.json'),
  
    token: _conf['Discord'].token,
    clientOptions: {
      getAllUsers: false,
      maxShards: 'auto',
      autoreconnect: true
    }
});

client.launch();

 process.on('ExperimentalWarning', (error) => print(1, `[${cyan('Master')}] !! ExperimentalWarning - ${red(`${error.message}`)}`));
 process.on('unhandledRejection', (error) => print(1, `[${cyan('Master')}] !! ExperimentalWarning - ${red(`${error.message}\n${error.stack}`)}`));
 process.on('uncaughtException', (error) => print(1, `[${cyan('Master')}] !! ExperimentalWarning - ${red(`${error.message}\n${error.stack}`)}`));
 process.on('error', (error) => print(1, `[${cyan('Master')}] !! ExperimentalWarning - ${red(`${error.message}\n${error.stack}`)}`));
 process.on('warn', (error) => print(1, `[${cyan('Master')}] !! ExperimentalWarning - ${red(`${error.message}`)}`));

process.on('SIGINT', () => {
    print(1, `[${cyan('Master')}] >> Closing connection from ${yellow(_conf.db)}`);
    print(1, `[${cyan('Master')}] >> Closing connection from websocket`);
    try {
      client.destory({reconnect: false});
      client.db.destory();
      process.exit(0);
    }catch(error) {
        process.exit(500);
    }
});