/**
 * @name Taggy#general:commands
 * @author: Wessel Tip <wessel@go2it.eu>
 * @license: GPL-3.0
 */
const BaseCommand = require('../../core/structures/BaseCommand');

class Commands extends BaseCommand {
  constructor(bot) {
    super(bot, {
      name: 'commands',
      syntax: 'commands',
      aliases: [ 'cmds', 'cmd', 'command' ],
      permissions: [ 'embedLinks' ],
      description: 'Get a list of available commands',

      enabled: true,
      hidden: false,
      cooldown: 1,
      category: 'General',
      guildOnly: false
    });
  }

  async execute(ctx) {
    ctx.sendEmbed({
      color: this.bot.col['COMMANDS'],
      description: this.bot.cmds.map(i => `\`${i.options.name}\``).join(', ')
    });
  }
}; 

module.exports = Commands;