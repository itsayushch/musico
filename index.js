require('dotenv').config();
const BotClient = require('./src/struct/BotClient');
const client = new BotClient();

//=========Message me daal lio =====//
// if(message.channel.id === 'AI channel id') {
//         fetch(`https://api.monkedev.com/fun/chat?msg=${message.content}&uid=${message.author.id}`)
//         .then(response => response.json())
//         .then(data => {
//             message.lineReplyNoMention(data.response)
//         })
//         .catch(() => {
//             message.lineReplyNoMention("Couldn't fetch Response!!");
//         })
//     }
client.start(process.env.TOKEN);
