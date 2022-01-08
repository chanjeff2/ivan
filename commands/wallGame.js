const { SlashCommandBuilder } = require('@discordjs/builders');
const Settings = require("../models/setting");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wall-game')
		.setDescription('wall game against someone')
		.addUserOption((option) =>
			option
			.setName("user")
			.setDescription("who you want to fu*k")
			.setRequired(true)
		),
	async execute(interaction) {
		const target = interaction.options.get("user").value;
		await interaction.reply(`I am playing wall game against <@${target}>.`);
	},
};