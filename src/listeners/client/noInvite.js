// /* eslint-disable class-methods-use-this */
// const { Listener } = require('discord-akairo');
// const { MessageEmbed } = require('discord.js');

// class NoInviteListener extends Listener {
//   constructor() {
//     super('noinvite', {
//       emitter: 'client',
//       event: 'message',
//       category: 'client',
//     });
//   }

//   async exec(message) {
//     if (await message.author.checkAdmin) return null;
//     const guildLogs = this.client.settings.get(message.guild, 'guildLog', undefined);
//     if (!/(https?:\/\/)?(www\.)?(discord\.(gg|li|me|io)|discordapp\.com\/invite)\/.+/.test(message.content)) return null;

//     const embed = new MessageEmbed().setColor(0x824aee)
//       .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
//       .setDescription(`${message.author.tag} (${message.author.id}) posted a invite ${message.content}`)
//       .setTimestamp(new Date());

//     const ember = new MessageEmbed().setColor(0x824aee)
//       .setDescription(`Hey ${message.author.username}, dont post invite links in ${message.guild.name}`);

//     message.author.send({ embed: ember });
//     if (guildLogs) {
//       const sendguild = message.guild;
//       sendguild.channels.cache.find((ch) => ch.id === guildLogs).send({ embed });
//     }
//     return message.delete().catch(() => null);
//   }
// }

// module.exports = NoInviteListener;
