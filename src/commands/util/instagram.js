// const {Command} = require('discord-akairo')
// const fetch = require("node-fetch");

// module.exports = class IGCommand extends Command {
//     constructor(){
// 		super('instagram', {
// 			aliases: ['instagram', 'insta' , 'ig'],
// 			category: 'utility',
// 			clientPermissions: ['SEND_MESSAGES'],
// 			args: [
// 				{
// 					id: 'name',
// 					type: 'string',
// 					match: 'content',
// 					prompt:{
// 						start:'Enter your username'
// 					}
// 				},
// 			],
// 			description: {
// 				content: 'Searches your instagram profile',
// 				usage: '[username]',
// 				examples: ['ayushkr_04']
// 			}
//         });
//     }
//     async exec(message, {name}) {
//         async function getUser(q){
//         const url = `https://instagram.com/${q}/?__a=1`;

//         let res;

//         try {
//             res = await fetch(url).then(url => url.json());
//             return res;
//         } catch (e) {
// 			message.reply(`User not found`);
// 			throw e;
//         }
//     }
//         const res = await getUser(name)
//         const account = res.graphql.user;
//         const embed = this.client.util.embed()
//             .setColor(0x5e17eb)
//             .setTitle(account.full_name)
//             .setURL(`https://instagram.com/${name}`)
//             .setThumbnail(account.profile_pic_url_hd)
//             .setDescription("Profile information")
//             .addField("**- Username:** ",`${account.username}`)
//             .addField("**- Full name:**" ,`${account.full_name}`)
//             if(account.biography.length) embed.addField("**- Biography**",` >>> ${account.biography}`)
//             .addField('**- Posts:**' ,`${account.edge_owner_to_timeline_media.count}`)
//             .addField('**- Followers:**', `${account.edge_followed_by.count}`)
//             .addField('**- Following:**', `${account.edge_follow.count}`)
//             if(account.is_private) embed.addField('**- Account type:**', "Private 🔐")
//             if(!account.is_private) embed.addField('**- Account type:**', "Public 🔓")
//             .setFooter('Powered by instagram API')
//             .setTimestamp();

//         message.channel.send(embed);


//     }

// }
