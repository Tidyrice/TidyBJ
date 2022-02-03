const prefix = require("./scripts/config.js");
const token = require("./scripts/token.js");
const Discord = require('discord.js');

const BJMap = new Map();

//status
client.on('ready', () => {
	console.log("TidyBJ ready to feed your gambling addiction!");
	console.log("Current guilds: " + client.guilds.cache.size);
	client.user.setPresence({
        activity: {
		    type: "PLAYING",
			name: 'use "!help"'
		}
    });
});

//when new message appears
client.on('message', async msg => {

    //dumbcheck
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    //cuts message into component words
    const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    //help
    if (command === "help") {
        const helplist = module.require("./scripts/helplist.js");
		msg.channel.send(help);
    }

    //blackjack
    if (command === "blackjack" || command === "bj") {
        const blackjack = require("./scripts/blackjack.js");
        blackjack.blackjack(msg, args, BJMap, Discord);
    }

});

client.login(token);
