/**
 * @name Taggy#Events:rawWS
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */
const BaseEvent = require('../core/structures/BaseEvent');
const { cyan, green, yellow } = require('../deps/Colors');

class RawWS extends BaseEvent {
  constructor(bot) {
    super(bot, {
      event: 'rawWS'
    });
  }

  execute(packet, ID) {
    this.bot.print(3, `[${cyan(`${ID !== undefined ? `Shard #${ID}` : 'Master'}`)}] >> '${green('RAWWS')}' packet received - ${yellow(packet)}`);
  }
};

module.exports = RawWS;