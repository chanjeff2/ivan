const { SlashCommandBuilder } = require('@discordjs/builders');
const Settings = require("../models/setting");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('enable')
		.setDescription('set enable/disable in this server')
		.addBooleanOption((option) =>
			option
			.setName("enable")
			.setDescription("enable or not")
			.setRequired(true)
		),
	async execute(interaction) {
		const guildId = interaction.guildId;
		const enable = interaction.options.getBoolean("enable");
		await Settings.findOneAndUpdate({
			guildId: guildId
		}, {
			$set: {
				enable: enable
			}
		}, {
			new: true,
			upsert: true // create new doc if doesn't exist
		})
		await interaction.reply(`I have been ${(enable) ? "enabled" : "disabled"} in this server.`);
	},
};