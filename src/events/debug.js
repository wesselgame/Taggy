/**
 * @name Taggy#Events:debug
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */
const BaseEvent = require('../core/structures/BaseEvent');
const { cyan, green, yellow } = require('../deps/Colors');

class Debug extends BaseEvent {
  constructor(bot) {
    super(bot, {
      event: 'debug'
    });
  }

  execute(message, ID) {
    this.bot.print(3, `[${cyan(`${ID !== undefined ? `Shard #${ID}` : 'Master'}`)}] >> '${green('DEBUG')}' packet received - ${yellow(message)}`);
  }
};

module.exports = Debug;