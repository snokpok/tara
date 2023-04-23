import Discord = require('discord.js');
const gateways = Discord.GatewayIntentBits;
import dotenv from 'dotenv';
import axios from 'axios'

// initializing environment variables
dotenv.config();

// Establishing Discord Client
const client = new Discord.Client({
	intents: [gateways.Guilds, gateways.GuildMessages, gateways.MessageContent],
});
client.login(process.env.DISCORD_TOKEN);
const prefix = '$';

// initializing Discord bot settings


// creating a Discord Listener for every message
client.on('messageCreate', async (message: Discord.Message<boolean>) => {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;
	const commandBody = message.content.slice(prefix.length);
	const args = commandBody.split(' ');
	const command = args.shift().toLowerCase();

	// test command to figure out what each element would mean
	if (command === 'test') {
		message.reply(
			`commandBody: ${commandBody}, args: ${args}, command: ${command}`
		);
	}

	// simple ask a question, get a response
	if (command === 'ask') {
		const question = args.join(' ');
		const params = { question: question };
		const result = await axios.post(`http://localhost:3333/chat`, params)
		message.reply(`${result.data.data}`);
	}

  // if (command === 'setupAnalytics') {
  //   const topics = []
  //   const channel = message.channel as Discord.TextChannel;
  //   channel.send(
  //     'You will now begin the setup process for data analytics. Please type out each class topic one at a time until you are done. If you are done, type $finishAnalytics or to exit from this message chain. What is the first topic?'
  //   );
  //   const filter = (msg: Discord.Message) => msg.author.id === message.author.id
  //   const collector = channel.createMessageCollector({
  //     filter,
  //     time: 600
  //   });
  //   collector.on('collect', async(response: Discord.Message) => {
  //     if (response.content === '$finishAnalytics') {
  //       collector.stop();
  //       await channel.send(
  //         `You have finished the setup process. The topics are: ${topics.join(', ')}`
  //       );
  //       return
  //     }
  //     if (response.content === '$setupAnalytics') {
  //       await channel.send('You\'ve already started the setup process. Please finish or cancel it first.');
  //       return;
  //     }
  //     if (response.content === '$delete') {
  //       if (topics.length > 0) {
  //         topics.pop();
  //         await channel.send('The previous topic has been removed. What is the next topic to add?');
  //       } else {
  //         await channel.send('There are no topics to delete.');
  //       }
  //       return;
  //     }
  //     topics.push(response.content);

  //     const confirmMessage = await channel.send(
  //       'Your response has been recorded. Would you like to add another topic? Please react with a ✅ to add, or react with an ❌ to delete the previous topic.'
  //     )
  //     await confirmMessage.react('✅');
  //     await confirmMessage.react('❌');

  //     const reactionFilter = (reaction: Discord.MessageReaction, user: Discord.User) => 
  //       user.id === message.author.id &&
  //       ['✅', '❌'].includes(reaction.emoji.name);

  //     const reactionCollector = confirmMessage.createReactionCollector({
  //       filter: reactionFilter,
  //       max: 1,
  //       time: 60000
  //     })

  //       reactionCollector.on('collect', async (reaction: Discord.MessageReaction) => {
  //         if (reaction.emoji.name === '✅') {
  //           await channel.send('Great! What\'s the next topic?');
  //         }

  //         if (reaction.emoji.name === '❌') {
  //           if (topics.length > 0) {
  //             topics.pop();
  //             await channel.send('The previous topic has been removed. What is the next topic to add?');
  //           } else {
  //             await channel.send('There are no topics to delete.');
  //           }x
  //         }
  //       });

  //       reactionCollector.on('end', async (collected: Discord.Collection<string, Discord.MessageReaction>) => {
  //         if (collected.size === 0) {
  //           await channel.send(
  //             'You did not react within 60 seconds, so the setup process has been cancelled.'
  //           );
  //         }
  //       });
  //     });

  //     collector.on('end', async (collected: Discord.Collection<string, Discord.Message>) => {
  //       if (collected.size === 0) {
  //         await channel.send(
  //           'You did not respond within 60 seconds, so the setup process has been cancelled.'
  //         );}
  //     });
  //   }
  //
});
