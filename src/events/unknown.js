/**
 * @name Taggy#Events:unknown
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */
const BaseEvent = require('../core/structures/BaseEvent');
const { cyan, green, yellow } = require('../deps/Colors');

class Unknown extends BaseEvent {
  constructor(bot) {
    super(bot, {
      event: 'unknown'
    });
  }

  execute(packet, ID) {
    this.bot.print(3, `[${cyan(`${ID !== undefined ? `Shard #${ID}` : 'Master'}`)}] >> '${green('UNKNOWN')}' packet received - ${yellow(packet)}`);
  }
};

module.exports = Unknown;