/**
 * @name Taggy#general:info
 * @author: Wessel Tip <wessel@go2it.eu>
 * @license: GPL-3.0
 */
const BaseCommand = require('../../core/structures/BaseCommand');

class About extends BaseCommand {
  constructor(bot) {
    super(bot, {
      name: 'about',
      syntax: 'about',
      aliases: [],
      permissions: [ 'embedLinks' ],
      description: 'Some information',

      enabled: true,
      hidden: false,
      cooldown: 1,
      category: 'General',
      guildOnly: false
    });
  }

  async execute(ctx) {
    ctx.send(`Hello there **${ctx.author.username}**!\nI'm ***${this.bot.username}***, a clone of https://github.com/PassTheWessel/Taggy ;)\nType \`${this.bot.conf['Discord'].prefix}commands\` for a list of all available commands.`);
  }
}; 

module.exports = About;