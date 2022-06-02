const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rng')
		.setDescription('Randomly generates a number between 1 to 7 (or any given number N)')
		.addNumberOption(option =>
      option
      .setName('n')
      .setDescription('The maximum number of the RNG giving')
    ),
  
	async execute(interaction) {
    let maxNum = interaction.options.getNumber("n");

    if (!maxNum) maxNum = 7;

    if (!(Number.isInteger(maxNum) && maxNum > 1)) {
      await interaction.reply({ content: "Please make sure your n is an integer greater than 1."});
      return;
    }

    const rolled = Math.floor(Math.random() * maxNum) + 1;

    const embed = new MessageEmbed()
								.setColor('#9FCEA9')
								.setTitle(`Roll a number between 1 and ${maxNum}`)
								.setDescription(`Oh! I got ${rolled}!`)

    await interaction.reply({ embeds: [embed] });
  }
};