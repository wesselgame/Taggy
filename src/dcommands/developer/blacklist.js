/**
 * @name Taggy#developer:blacklist
 * @author: Wessel Tip <wessel@go2it.eu>
 * @license: GPL-3.0
 */ 
const BaseCommand = require('../../core/structures/BaseCommand');

class Blacklist extends BaseCommand {
  constructor(bot) {
    super(bot, {
      name: 'blacklist',
      syntax: 'blacklist [list]',
      aliases: [ 'bl' ],
      permissions: [ 'embedLinks' ],
      description: 'Black/whitelists an user',

      enabled: true,
      hidden: true,
      cooldown: 1,
      category: 'Developer',
      ownerOnly: true,
      guildOnly: true
    });
  }

  async execute(ctx, args, srv) {
    if (args[0] && args.join(' ').toLowerCase() === 'list') {
      return ctx.sendEmbed({
        color: this.bot.col['BLACKLIST'],
        description: [
          `${this.bot.emoji['BLACKLIST']['0']} **Blacklisted users**:`,
          srv.blacklist[0] ? srv.blacklist.trim(120).map((i) => `\`${i}\``).join(' **/** ') : 'n/a'
        ].join('\n')
      });
    }
    this.bot.util.resolveUser(args[0] ? args.join(' ') : undefined, this.bot).then((user) => {
      if (srv.blacklist.includes(user.id)) {
        const blacklist = srv.blacklist;
        blacklist.splice(blacklist.indexOf(user.id), 1);
        this.bot.mongo['schemas']['srv'].update({ serverId: ctx.guild.id }, { blacklist: blacklist }).then((err) => {});
        ctx.send(`${this.bot.emoji['BLACKLIST']['0']} **>** ${ctx.author.mention}, ${user.username}#${user.discriminator} (${user.id}) has been removed from the blacklist`);
      } else {
        const blacklist = srv.blacklist;
        blacklist.push(user.id);
        this.bot.mongo['schemas']['srv'].update({ serverId: ctx.guild.id }, { blacklist: blacklist }).then((err) => {});
        ctx.send(`${this.bot.emoji['BLACKLIST']['0']} **>** ${ctx.author.mention}, ${user.username}#${user.discriminator} (${user.id}) has been added to the blacklist`);
      }
    }).catch((err) => {
      return ctx.send(`${this.bot.emoji['BLACKLIST']['0']} **>** ${ctx.author.mention}, You've provided an invalid user`);
    });
  }
};

module.exports = Blacklist;