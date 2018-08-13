/**
 * @name Taggy#general:ping
 * @author: Wessel Tip <wessel@go2it.eu>
 * @license: GPL-3.0
 */
const BaseCommand = require('../../core/structures/BaseCommand');

class Ping extends BaseCommand {
  constructor(bot) {
    super(bot, {
      name: 'ping',
      syntax: 'ping',
      aliases: [ 'pong' ],
      permissions: [ 'embedLinks' ],
      description: 'Get my current latency to discord',

      enabled: true,
      hidden: false,
      cooldown: 1,
      category: 'General',
      guildOnly: false
    });
  }

  async execute(ctx) {
    ctx.send(`Pong! \`${ctx.guild ? ctx.guild.shard.latency : 'n/a'}\`ms`);
  }
}; 

module.exports = Ping;