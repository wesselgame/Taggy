/**
 * @name Taggy#Client
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */
const Eris = require('eris').Client;
const Util = require('../util/Util');
const path = require('path');
const { cyan, red } = require('../deps/Colors');

const DBManager = require('./managers/DBManager');
const Collection = require('../util/Collection');

const EventStore = require('./stores/EventStore');
const CommandStore = require('./stores/CommandStore');
const PermissionUtil = require('../util/PermissionUtil');
const MessageCollector = require('../util/MessageCollector');

class Taggy extends Eris {
  constructor(options) {
    super(options.token, options.clientOptions);
    
    this.cmds = new Collection();
    this.cache = new Collection();
    
    this.db = new DBManager(options.db ? options.db : undefined);
    this.collector = new MessageCollector(this);
    this.eventStore = new EventStore(this);
    this.commandStore = new CommandStore(this);

    this.ua = options.config.ua ? options.config.ua : undefined;
    this.util = Util;
    this.print = Util.print;
    this.Collection = Collection;

    this.col = options.colors ? options.colors : undefined;
    this.conf = options.config ? options.config : undefined;
    this.emoji = options.emojis ? options.emojis : undefined;
    this.package = options.package ? options.package : undefined;
  }

  launch() {
    this.eventStore.run(path.join(__dirname, '..', 'events'));
    this.commandStore.run(path.join(__dirname, '..', 'dcommands'));
    
    this.mongo = this.db.launch();
    this.connect()
      .then(() => this.print(1, `[${cyan('Master')}] >> Connecting shards to websockets`));
  }

  op(id) { return this.conf['Discord'].op.includes(id); }
  gatherInvite(permission) {
    permission = PermissionUtil.resolve(permission);
    return `https://discordapp.com/oauth2/authorize?client_id=${this.user.id}&scope=bot&permissions=${permission}`;
  }

  destory() {
    let trace = { success: false };
    this.print(1, `[${cyan('Master')}] >> Disconnecting shards from websockets`);
    try {
      this.disconnect({ reconnect: false });
      trace.success = true;
    } catch (err) {
      trace.success = false;
      trace.err = {
        code: err.code,
        message: err.message,
        stack: err.stack
      };
    }
    this.print(1, `[${cyan('Master')}] >> Destroy callback - ${red(trace)}`);
    process.exit(0);
  }
};

module.exports = Taggy;