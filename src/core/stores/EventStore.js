/**
 * @name Taggy#EventStore
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */
const { readdirSync } = require('fs');
const { green: green, red: red, cyan: cyan } = require('../../deps/Colors');

class EventStore {
  constructor(bot) {
    this.bot = bot;
  }

  doEvent(event) {
    const doAsync = async(...args) => {
      try {
        await event.execute(...args);
      } catch(err) {
        this.bot.print(1, `[${cyan('Master')}] !! EventError - ${red(`${err.message}\n${err.stack}`)}`);
      }
    };

    this.bot.on(event.event, doAsync);
  }

  async run(dir) {
    const files = await readdirSync(dir);
    this.bot.print(1, `[${cyan('Master')}] >> Loading ${green(files.length)} events`);
    files.forEach((f) => {
      const evt = require(`${dir}/${f}`);
      const event = new evt(this.bot);
      this.bot.print(2, `[${cyan('Master')}] >> Loaded event ${green(event.event)}`);

      this.doEvent(event);
    });
    return {
      success: true
    };
  }

  toJSON() { return { bot: this.bot }; }
};

module.exports = EventStore;