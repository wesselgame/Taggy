/**
 * @name Taggy#CommandStore
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const date = new Date();
const path = require('path');
const { readdir: readdir, readdirSync: readdirSync } = require('fs');
const { cyan: cyan, red: red, green: green, yellow: yellow } = require('../../deps/Colors');

const Context = require('../structures/Context');
const Collection = require('../../util/Collection');
const { Collection: erisCollection } = require('eris');

class CommandStore {
  constructor(bot) {
    this.bot = bot;
    this.cooldowns = new erisCollection();
  }

  async run(dir) {
    const categories = await readdirSync(dir);

    for (let i = 0; i < categories.length; i++) {
      readdir(`${dir}/${categories[i]}`, (err, files) => {
        if (err) this.bot.print(1, `[${cyan('Master')}] !! LoadError - ${red(`${err.message}\n${err.stack}`)}`);
        this.bot.print(1, `[${cyan('Master')}] >> Loading ${green(files.length)} commands in category ${green(categories[i])}`);
        files.forEach((file) => {
          try {
            this.start(dir, categories[i], file);
          } catch (err) {
            this.bot.print(1, `[${cyan('Master')}] !! LoadError - ${red(`${err.message}\n${err.stack}`)}`);
          }
        });
      });
    }
  }

  start(dir, category, file) {
    const cmd = require(`${dir}/${category}/${file}`);
    const command = new cmd(this.bot);
    command.options.location = dir;
    
    if (!command.options.enabled) return;
    if (!this.bot.conf['Discord']['Commands'][command.options.name]) return;
    
    if (this.bot.cmds.has(command.options.name)) this.bot.print(1, `[${cyan('Master')}] !! Duplicate command found - ${red(`${dir}/${category}/${file}`)}`);
    this.bot.cmds.set(command.options.name, command);
    this.bot.print(2, `[${cyan('Master')}] >> Loaded command ${green(command.options.name)}`);
  }

  reloadCommand(command) {
    const cmd = this.bot.cmds.get(command);
    if (!cmd) return false;
    
    const dir = cmd.options.location;
    this.bot.cmds.delete(command);
    delete require.cache[require.resolve(dir)];
    this.start(cmd.options.location);
    return true;
  }

  async handleCommand(msg) {
    if (msg.author.bot || !this.bot.ready) return;

    let prefix = new RegExp(`^<@!?${this.bot.user.id}> |^${this.bot.conf['Discord'].prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`)
    .exec(msg.content);
    if (!prefix) return;

    let srv;
    if (msg.channel.guild) srv = await this.bot.mongo['schemas']['srv'].findOne({ serverId: msg.channel.guild.id });
    if (!this.bot.op(msg.author.id) && srv.blacklist.includes(msg.author.id)) return;

    const ctx = new Context(this.bot, msg);
    ctx.setPrefix(this.bot.conf['Discord'].prefix);
    const args = msg.content.slice(prefix[0].length).trim().split(/ +/g);
    const cmd = args.shift();
    const perm = msg.channel.permissionsOf(this.bot.user.id);
    const command = this.bot.cmds.filter((c) => c.options.name === cmd || c.options.aliases.includes(cmd));
    
    if (command.length > 0) {
      if (command[0].options.ownerOnly && !this.bot.op(ctx.author.id)) {
        return msg.channel.createMessage({
          content: `${this.bot.emoji['OWNER_ONLY']['0']} **>** ${msg.author.mention}, You're missing permissions in order to execute this command`
        });
      }
      if (command[0].options.guildOnly && ctx.guild.type === 1) {
        return msg.channel.createMessage({
          content: `${this.bot.emoji['GUILD_ONLY']['0']} **>** ${msg.author.mention}, This command can only be used in guilds`
        });
      }
      if ((command[0].options.permissions && command[0].options.permissions.some(p => !perm.has(p))) || !perm.has('sendMessages')) return;
      if (!this.cooldowns.has(command[0].options.command)) this.cooldowns.set(command[0].options.command, new erisCollection());

      const now = Date.now();
      const timestamps = this.cooldowns.get(command[0].options.command);
      const cooldownAmount = (command[0].options.cooldown) * 1000;

      if (!timestamps.has(msg.author.id)) {
        timestamps.set(msg.author.id, now);
        setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
      } else {
        const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return msg.channel.createMessage({
            content: `${this.bot.emoji['COOLDOWN']['0']} **>** ${msg.author.mention}, This command is on cooldown for another **${timeLeft.toFixed(1)} ${Math.floor(timeLeft) === 0 || Math.floor(timeLeft) > 1 ? 'seconds': 'second'}**`
          });
        }

        timestamps.set(msg.author.id, now);
        setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
      }

      try {
        await command[0].execute(ctx, args, srv);
        this.bot.print(3, `[${cyan(`Shard #${msg.channel.guild.shard.id}`)}] >> Command '${command[0].options.name}' executed by ${yellow(ctx.author.id)}`);
      } catch (err) {
        this.bot.print(1, `[${cyan('Master')}] !! CommandError - ${red(`${err.message}\n${err.stack}`)}`);
        msg.channel.createMessage({
          content: [
            `${this.bot.emoji['ERROR']['0']} **>** ${msg.author.mention}, an error occured while executing this command`,
            `If this problem keeps occuring, consider joining ***https://discord.gg/SV7DAE9*** and posting your problem there`
          ].join('\n')
        });
      }
    }
  }
};

module.exports = CommandStore;