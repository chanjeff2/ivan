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
		const guildId = interaction.guild_id;
		const enable = interaction.options.get("enable").value;
		await Settings.findOneAndUpdate({
			guildId: guildId
		}, {
			upsert: true, // create new doc if doesn't exist
			$set: {
				enable: enable
			}
		})
		await interaction.reply(`I have been ${(enable) ? "enabled" : "disabled"} in this server.`);
	},
};