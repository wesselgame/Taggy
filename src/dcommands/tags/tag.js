/**
 * @name Taggy#tags:exec
 * @author: Wessel Tip <wessel@go2it.eu>
 * @license: GPL-3.0
 */
const BaseCommand = require('../../core/structures/BaseCommand');

class Tag extends BaseCommand {
  constructor(bot) {
    super(bot, {
      name: 'tag',
      syntax: 'tag <...name:string>',
      aliases: [ 't' ],
      permissions: [],
      description: 'Execute a tag',

      enabled: true,
      hidden: false,
      cooldown: 1,
      category: 'Tags',
      guildOnly: true
    });
  }

  async execute(ctx, args) {
    const tag = await this.bot.mongo['schemas']['tag'].findOne({ name: args.join(' ').toLowerCase(), guildId: ctx.guild.id });
    if (!tag) {
      return ctx.send(`${this.bot.emoji['TAG']['0']} **>** ${ctx.author.mention}, No tags found with that name`);
    }

    ctx.send(tag.description);
    this.bot.mongo['schemas']['tag'].update({ name: tag.name, guildId: ctx.guild.id }, { used: tag.used +1 }).then((err) => {});
  }
}; 

module.exports = Tag;