/**
 * @name Taggy#tags:add
 * @author: Wessel Tip <wessel@go2it.eu>
 * @license: GPL-3.0
 */
const BaseCommand = require('../../core/structures/BaseCommand');
const moment = require('moment');

class TagAdd extends BaseCommand {
  constructor(bot) {
    super(bot, {
      name: 'tag-add',
      syntax: 'tag-add <...name:string> | <...description:string>',
      aliases: [ 'tagadd', 'addtag', 'add-tag', 'tag-create', 'create-tag' ],
      permissions: [],
      description: 'Create a tag',

      enabled: true,
      hidden: false,
      cooldown: 1,
      category: 'Tags',
      guildOnly: true
    });
  }

  async execute(ctx, args) {
    let name;
    let description;
    const components = args.join(' ').split(/\|/g);
    try {
      if (!components[0]) {
        ctx.send(`${this.bot.emoji['TAG_ADD']['0']} **>** ${ctx.author.mention}, What do you want your tag to be called?`);
        const nameCollector = await this.bot.collector.awaitMessage
          (ctx.channel.id, ctx.author.id, 60e3);
        if (!nameCollector) {
          return ctx.send(`${this.bot.emoji['TAG_ADD']['1']} **>** ${ctx.author.mention}, This prompt has been cancelled`);
        }
        name = nameCollector.content.slice(0, 50).toLowerCase().trim();
      } else name = components[0].slice(0, 50).toLowerCase().trim();
      if (!components[1]) {
        ctx.send(`${this.bot.emoji['TAG_ADD']['0']} **>** ${ctx.author.mention}, What do you want your tag's description to be?`);
        const descCollector = await this.bot.collector.awaitMessage
          (ctx.channel.id, ctx.author.id, 60e3);
        if (!descCollector) {
          return ctx.send(`${this.bot.emoji['TAG_ADD']['1']} **>** ${ctx.author.mention}, This prompt has been cancelled`);
        }
        description = descCollector.content.slice(0, 1950).trim();
      } else description = components.slice(1, 1950).join(' ').trim();
    } catch (err) {
      ctx.send({
        content: [
          `${this.bot.emoji['ERROR']['0']} **>** ${ctx.author.mention}, an error occured while executing this command`,
          `If this problem keeps occuring, consider joining ***https://discord.gg/SV7DAE9*** and posting your problem there`
        ].join('\n')
      });
    } finally {
      if (this.bot.cmds.filter((c) => c.options.name === name || c.options.aliases.includes(name)).length > 0) {
        return ctx.send(`${this.bot.emoji['TAG_ADD']['1']} **>** ${ctx.author.mention}, A tag name cannot be a command's name or alias`);
      }
      const tag = await this.bot.mongo['schemas']['tag'].findOne({ name: name, guildId: ctx.guild.id });
      if (tag) {
        return ctx.send(`${this.bot.emoji['TAG_ADD']['1']} **>** ${ctx.author.mention}, A tag with that name already exists`);
      }
      const msg = await ctx.channel.createMessage(`${this.bot.emoji['TAG_ADD']['2']} **>** ${ctx.author.mention}, Trying to create your tag...`);
      const query = this.bot.mongo['schemas']['tag']({
        name: name,
        description: description,
        events: [`TAG_CREATE:${moment(new Date).format('DD-MM-YYYY')}`],
        guildId: ctx.guild.id,
        author: {
          userId: ctx.author.id,
          username: ctx.author.username,
          discriminator: ctx.author.discriminator
        }
      });
      query.save();
      msg.edit(`${this.bot.emoji['TAG_ADD']['3']} ${ctx.author.mention}, Your tag has been created`);
    }
  }
}; 

module.exports = TagAdd;