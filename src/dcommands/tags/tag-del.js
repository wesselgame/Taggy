/**
 * @name Taggy#tags:del
 * @author: Wessel Tip <wessel@go2it.eu>
 * @license: GPL-3.0
 */
const BaseCommand = require('../../core/structures/BaseCommand');

class TagDel extends BaseCommand {
  constructor(bot) {
    super(bot, {
      name: 'tag-del',
      syntax: 'tag-del <...name:string>',
      aliases: [ 'tagdel', 'deltag', 'del-tag' ],
      permissions: [],
      description: 'Delete a tag',

      enabled: true,
      hidden: false,
      cooldown: 1,
      category: 'Tags',
      guildOnly: true
    });
  }

  async execute(ctx, args) {
    const tag = await this.bot.mongo['schemas']['tag'].findOne({ name: args.join(' ').toLowerCase(), guildId: ctx.guild.id });
    const perm = ctx.channel.permissionsOf(ctx.author.id);
    if (!tag) {
      return ctx.send(`${this.bot.emoji['TAG_DEL']['0']} **>** ${ctx.author.mention}, No tags found with that name`);
    }
    if (!perm.has('manageMessages')) {
      if (ctx.author.id !== tag.author.userId) {
        return ctx.send(`${this.bot.emoji['TAG_DEL']['1']} **>** ${ctx.author.mention}, You're missing permissions to execute this command (\`manageMessages\`/\`tagAuthor\`)`);
      }
    }
    const msg = await ctx.channel.createMessage(`${this.bot.emoji['TAG_DEL']['2']} **>** ${ctx.author.mention}, Trying to delete the tag...`);
    this.bot.mongo['schemas']['tag'].deleteOne({ name: args.join(' ').toLowerCase(), guildId: ctx.guild.id }).then((err) => {});
    msg.edit(`${this.bot.emoji['TAG_DEL']['3']} **>** ${ctx.author.mention} Deleted tag \`${tag.name}\``);
  }
}; 

module.exports = TagDel;