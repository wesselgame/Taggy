/**
 * @name Taggy#developer:eval
 * @author: Wessel Tip <wessel@go2it.eu>
 * @license: GPL-3.0
 */ 
const BaseCommand = require('../../core/structures/BaseCommand');
const util = require('util');

let input;
let silent;
let result;
let asynchr;

class Eval extends BaseCommand {
  constructor(bot) {
    super(bot, {
      name: 'eval',
      syntax: 'eval [...code:string]',
      aliases: [ 'evaluate' ],
      permissions: [ 'embedLinks' ],
      description: 'Evaluate a snippet of code',

      enabled: true,
      hidden: true,
      cooldown: 1,
      category: 'Developer',
      ownerOnly: true,
      guildOnly: false
    });
  }

  async execute(ctx, args, srv) {
    if (!args[0]) {
      input = 'this';
    } else {
      input = args.join(' ');
    }

    silent = input.includes('-slient') || input.includes('-s');
    asynchr = input.includes('return') || input.includes('await');
    if (silent) {
      input = input.replace('--silent', '').replace('-s', '');
    }

    try {
      result = await (asynchr ? eval(`(async()=>{${input}})();`) : eval(input));
      
      if (typeof result !== 'string') {
        result = util.inspect(result);
      } else {
        result = result;
      }
    } catch(err) {
      result = err.message;
    } finally {
      if (silent) return;
      ctx.sendEmbed({
        color: this.bot.col['EVAL'],
        description: `${this.bot.emoji['EVAL']['0']} **Result**:\n\`\`\`js\n${this.bot.util.shorten(this.bot.util.redact(result), 1990)}\`\`\``
    });
    }
  }
};

module.exports = Eval;