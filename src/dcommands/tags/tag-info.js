/**
 * @name Taggy#tags:info
 * @author: Wessel Tip <wessel@go2it.eu>
 * @license: GPL-3.0
 */
const BaseCommand = require('../../core/structures/BaseCommand');
const moment = require('moment');

class TagInfo extends BaseCommand {
  constructor(bot) {
    super(bot, {
      name: 'tag-info',
      syntax: 'tag-info <...name:string>',
      aliases: ['taginfo', 'infotag'],
      permissions: [],
      description: 'Get some information about a tag',

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

    ctx.sendEmbed({
      color: this.bot.col['TAG_INFO'],
      description: [
        `${this.bot.emoji['TAG_INFO']['0']} **Name**: ${tag.name}`,
        `${this.bot.emoji['TAG_INFO']['1']} **Used**: ${tag.used}`,
        `${this.bot.emoji['TAG_INFO']['2']} **Author**: ${tag.author.username}#${tag.author.discriminator} (\`${tag.author.userId}\`)`,
        `${this.bot.emoji['TAG_INFO']['3']} **Creation**: ${moment(tag.date).format('DD[/]MM[/]YYYY HH[:]mm')}\n`,
        `Type \`${this.bot.conf['Discord'].prefix}tag ${tag.name}\` to display this tag`,
        `Type \`${this.bot.conf['Discord'].prefix}tag-del ${tag.name}\` to delete this tag ***(Perms only)***`,
        `Type \`${this.bot.conf['Discord'].prefix}tag-edit ${tag.name}\` to edit this tag ***(Author only)***`,
        `Type \`${this.bot.conf['Discord'].prefix}tag-source ${tag.name}\` to display the source of this tag\n`,
        `**Triggered Events**: ${tag.events ? tag.events.trim(20).join(' **/** ') : 'n/a'}`
      ].join('\n')
    });
  }
}; 

module.exports = TagInfo;