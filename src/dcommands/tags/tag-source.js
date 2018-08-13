/**
 * @name Taggy#tags:source
 * @author: Wessel Tip <wessel@go2it.eu>
 * @license: GPL-3.0
 */
const BaseCommand = require('../../core/structures/BaseCommand');

class TagSource extends BaseCommand {
  constructor(bot) {
    super(bot, {
      name: 'tag-source',
      syntax: 'tag-source <...name:string>',
      aliases: ['tagsource'],
      permissions: [],
      description: 'Get the source of a tag',

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
      return ctx.send(`${this.bot.emoji['TAG_SOURCE']['0']} **>** ${ctx.author.mention}, No tags found with that name`);
    }

    ctx.send(`${this.bot.emoji['TAG_SOURCE']['1']} Here's the source:\n\`\`\`${this.bot.util.shorten(tag.description.replace(/`/g, '`\u200b'), 1950)}\`\`\``);
  }
}; 

module.exports = TagSource;