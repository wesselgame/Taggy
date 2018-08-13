/**
 * @name Taggy#DB:schemas
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */
const { safeLoad } = require('js-yaml');
const { readFileSync } = require('fs');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const _conf = safeLoad(readFileSync('application.yml', 'utf8'));

const Tag = new Schema({
  used: { type: Number, default: 0 },
  date: { type: Date, default: new Date() },
  name: { type: String, default: undefined },
  description: { type: String, default: undefined },
  
  events: [],
  guildId: { type: String, default: undefined },
  author: {
    userId: { type: String, default: undefined },
    username: { type: String, default: undefined },
    discriminator: { type: String, default: undefined }
  }
});

const guild = new Schema({
  serverId: { type: String, default: undefined },
  blacklist: [],
  whitelist: []
});

exports.srv = mongoose.model('srv', guild, 'srv');
exports.tag = mongoose.model('tags', Tag, 'tags');