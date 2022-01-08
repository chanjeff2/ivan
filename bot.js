const { Client, Collection, Intents } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const Settings = require("./models/setting");

// load .env
dotenv.config();

// connect mongodb
const url = process.env.MONGODB_URI;
const connect = mongoose.connect(url);

connect.then((db) => {
	console.log("Connected correctly to server");
}, (err) => { console.log(err); });

// create client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

// on bot ready/started
client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
})

client.on("message", async (message) => {
	// prevent self loop
	if (message.author == client.user) {
		return;
	}
	// ignore user/channel mentions
	if (message.content.match(/<@(!|&)?(\d+)>|<#(\d+)>/)) {
		return;
	}

	// replace "7" with "ivan" if enabled
	if (message.content.includes("7")) {
		const guildId = message.guildId;
		var setting = await Settings.findOneAndUpdate({
			guildId: guildId
		}, {

		}, {
			upsert: true,
			new: true
		});

		if (!setting.enable) {
			return;
		}

		message.reply(message.content.replaceAll("7", " **Ivan** "));
	}
})

// slash commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

const token = process.env.TOKEN;
client.login(token);