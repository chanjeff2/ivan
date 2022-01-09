const { SlashCommandBuilder } = require('@discordjs/builders');
const Settings = require("../models/setting");

module.exports = {
    data: new SlashCommandBuilder()
		.setName('burger')
		.setDescription('Perform mitosis on burgers and have a burger party!')
		.addSubcommand(subcommand => 
			subcommand
			.setName('reset')
			.setDescription('Reset the number of hamburgers to 1.'))
		.addSubcommand(subcommand => 
			subcommand
			.setName('status')
			.setDescription('Check the number of hamburgers the server has now.'))
		.addSubcommand(subcommand => 
			subcommand
			.setName('clone')
			.setDescription('Perform mitosis on the hamburgers.')
			.addNumberOption(option =>
				option
				.setName('count')
				.setDescription('The number of hamburgers to clone.')
				.setRequired(true)))
		.addSubcommand(subcommand => 
			subcommand
			.setName('meal')
			.setDescription('Give a hamburger to a user.')
			.addUserOption(option =>
				option
				.setName('target')
				.setDescription('The user that is given a hamburger.')
				.setRequired(true)))
		,
	async execute(interaction) {
		const guildId = interaction.guildId;
		var setting = await Settings.findOneAndUpdate({
			guildId: guildId
		}, {
			
		}, {
			upsert: true,
			new: true
		});
		const currentCount = setting.burgers;

		if (interaction.options.getSubcommand() === 'reset') {
			await Settings.findOneAndUpdate({
				guildId: guildId
			}, {
				$set: {
					burgers: 1
				}
			}, {
				new: true,
				upsert: true
			})
			await interaction.reply({content: ":hamburger: I have forfeited all hamburgers in the server and bought one from McDonalds!"});
		}
		if (interaction.options.getSubcommand() === 'status') {
			var setting = await Settings.findOneAndUpdate({
				guildId: guildId
			}, {
	
			}, {
				upsert: true,
				new: true
			});
			const count = setting.burgers;
			await interaction.reply({content: `:hamburger: There are **${currentCount}** burgers available.`});
		}
		if (interaction.options.getSubcommand() === 'clone') {
			// Get the current number of burgers first, then update it.
			if (currentCount < 1) { 
				await interaction.reply({content: "**ERROR:** There are no burgers. Please reset by `/burger reset`."});
				return;
			}
			const cloneAmount = interaction.options.getNumber("count");
			if (cloneAmount < 1 || !Number.isInteger(cloneAmount)) { 
				await interaction.reply({content: "**ERROR:** Please enter a positive integer."});
				return;
			}
			const finalNum = currentCount + cloneAmount;

			await Settings.findOneAndUpdate({
				guildId: guildId
			}, {
				$set: {
					burgers: finalNum
				}
			}, {
				upsert: true,
				new: true
			});
			await interaction.reply({content: `:hamburger: **${cloneAmount}** Burgers are cloned.`});
		}
		if (interaction.options.getSubcommand() === 'meal') {
			// Get the current number of burgers first, then update it.
			if (currentCount < 1) { 
				await interaction.reply({content: "**ERROR:** There are no burgers. Please reset by `/burger reset`."});
				return;
			}
			const finalNum = currentCount - 1;
			const target = interaction.options.getUser('target');

			await Settings.findOneAndUpdate({
				guildId: guildId
			}, {
				$set: {
					burgers: finalNum
				}
			}, {
				upsert: true,
				new: true
			});
			await interaction.reply({content: `:hamburger: I gave ${target} a hamburger. There are **${finalNum}** burgers left.`});
		}
	},
};