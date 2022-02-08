const {Client, Intents, User, MessageEmbed, Message} = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES]})

const prefix = require("./scripts/config.js");
const token = require("./scripts/token.js");
const Discord = require('discord.js');

const BJMap = new Map();

//status
client.on('ready', () => {
	console.log("TidyBJ ready to feed your gambling addiction!");
	console.log("Current guilds: " + client.guilds.cache.size);
	client.user.setPresence({
        activities: [{
               name: 'use "!help"'
           }],
        status: 'online'
    });
});

//when new message appears
client.on('messageCreate', async msg => {

    //dumbcheck
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    //cuts message into component words
    const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    //help
    if (command === "help") {
        const helplist = require("./scripts/helplist.js");
		msg.channel.send(helplist);
    }

    //blackjack
    if (command === "blackjack" || command === "bj") {
        const blackjack = require("./scripts/blackjack.js");
        blackjack.blackjack(msg, args, BJMap, Discord);
    }

});

client.login(token);
