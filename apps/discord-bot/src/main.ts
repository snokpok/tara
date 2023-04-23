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
    const CLASS_1 = "1098718327393759303"
    const CLASS_8 = "1099660606849695814"
		const question = args.join(' ');
		const params = { question: question };
    let result
    if(message.guild) {
      const guildId = message.guild.id;
      if (guildId === CLASS_1) {
        result = await axios.post(`http://localhost:3333/chat?courseId=1`, params, {validateStatus: () => true});
        const topic_params = { solution: result.data.data, class_id: 1 }
        const topic = await axios.post(`http://localhost:6363/topics`, topic_params)
      } 
      if (guildId === CLASS_8) {
        result = await axios.post(`http://localhost:3333/chat?courseId=8`, params, {validateStatus: () => true});
        const topic_params = { solution: result.data.data, class_id: 8 }
        const topic = await axios.post(`http://localhost:6363/topics`, topic_params)
      }
      await message.reply(`${result.data.data}`)
    }
  }
});
