/**
 * @name Taggy#tags:edit
 * @author: Wessel Tip <wessel@go2it.eu>
 * @license: GPL-3.0
 */
const BaseCommand = require('../../core/structures/BaseCommand');
const moment = require('moment');

class TagEdit extends BaseCommand {
  constructor(bot) {
    super(bot, {
      name: 'tag-edit',
      syntax: 'tag-edit <...name:string> | <...description:string>',
      aliases: [ 'tagedit', 'edittag', 'edit-tag' ],
      permissions: [],
      description: 'Edit a tag',

      enabled: true,
      hidden: false,
      cooldown: 1,
      category: 'Tags',
      guildOnly: true
    });
  }

  async execute(ctx, args) {
    let description;
    const components = args.join(' ').split(/\|/g);

    const tag = await this.bot.mongo['schemas']['tag'].findOne({ name: components[0] ? components[0].trim() : undefined, guildId: ctx.guild.id });
    if (!tag) {
      return ctx.send(`${this.bot.emoji['TAG_EDIT']['0']} **>** ${ctx.author.mention}, No tags found with that name`);
    }
    if (ctx.author.id !== tag.author.userId) {
      return ctx.send(`${this.bot.emoji['TAG_EDIT']['1']} **>** ${ctx.author.mention}, You're missing permissions to execute this command (\`manageMessages\`/\`tagAuthor\`)`);
    } 
    try {
      if (!components[1]) {
        ctx.send(`${this.bot.emoji['TAG_EDIT']['2']} **>** ${ctx.author.mention}, What do you want your tag's description to be?`);
        const descCollector = await this.bot.collector.awaitMessage
          (ctx.channel.id, ctx.author.id, 60e3);
        if (!descCollector) {
          return ctx.send(`${this.bot.emoji['TAG_EDIT']['3']} **>** ${ctx.author.mention}, This prompt has been cancelled`);
        }
        description = descCollector.slice(0, 1950).content.trim();
      } else description = components.slice(1, 1950).join(' ').trim();
    } catch (err) {
      ctx.send({
        content: [
          `${this.bot.emoji['ERROR']['0']} **>** ${ctx.author.mention}, an error occured while executing this command`,
          `If this problem keeps occuring, consider joining ***https://discord.gg/SV7DAE9*** and posting your problem there`
        ].join('\n')
      });
    } finally {
      const msg = await ctx.channel.createMessage(`${this.bot.emoji['TAG_EDIT']['4']} **>** ${ctx.author.mention}, Trying to edit your tag...`);
      const events = tag.events ? tag.events.push(`TAG_UPDATE:${moment(new Date).format('DD-MM-YYYY')}`) : [`TAG_UPDATE:${moment(new Date).format('DD-MM-YYYY')}`];
      this.bot.mongo['schemas']['tag'].update({ name: components[0].trim(), guildId: ctx.guild.id }, { description: description, events: events }).then((err) => {});
      msg.edit(`${this.bot.emoji['TAG_EDIT']['5']} **>** ${ctx.author.mention} Your tag has been updated`);
    }
  }
}; 

module.exports = TagEdit;