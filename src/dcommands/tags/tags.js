/**
 * @name Taggy#tags:list
 * @author: Wessel Tip <wessel@go2it.eu>
 * @license: GPL-3.0
 */
const BaseCommand = require('../../core/structures/BaseCommand');

class Tags extends BaseCommand {
  constructor(bot) {
    super(bot, {
      name: 'tags',
      syntax: 'tags',
      aliases: [ 'ts' ],
      permissions: [],
      description: 'Get a list of all tags',

      enabled: true,
      hidden: false,
      cooldown: 1,
      category: 'Tags',
      guildOnly: true
    });
  }

  async execute(ctx, args) {
    const tags = await this.bot.mongo['schemas']['tag'].find({ guildId: ctx.guild.id }).sort({ used: -1 });
    if (!tags) {
      return ctx.send(`${this.bot.emoji['TAGS']['0']} **>** ${ctx.author.mention}, No tags found on this guild`);
    }

    ctx.send([
      `${this.bot.emoji['TAGS']['0']} **>** ${ctx.author.mention}, Tags in ***${ctx.guild.name}***:`,
      tags.trim(35).map((i) => `\`${i.name}\``).join(', ')
    ].join('\n'));
  }
}; 

module.exports = Tags;