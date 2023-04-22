import Discord = require("discord.js");
const gateways = Discord.GatewayIntentBits;
import dotenv from 'dotenv';

// initializing environment variables
dotenv.config();

// Establishing Discord Client
const client = new Discord.Client({intents: [gateways.Guilds, gateways.GuildMessages, gateways.MessageContent]});
client.login(process.env.DISCORD_TOKEN)
const prefix = '$';

// creating a Discord Listener for every message
client.on("messageCreate", async (message: Discord.Message<boolean>) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  // test command to figure out what each element would mean
  if (command === 'test') {
    message.reply(`commandBody: ${commandBody}, args: ${args}, command: ${command}`);
  }

  // simple ask a question, get a response
  if (command === 'ask') {
    const question = args.join(" ");
    const params = { question: question };
    const result = await fetch(`localhost:3333/chat`, {
      method: "GET",
      headers : {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params)
    }).then(response => {
      return response.json();
    })
    message.reply(`${result}`)
  }

  //
});

