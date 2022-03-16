const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas')
const alertPicURL = __dirname + '/../public/images/alert.png'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('alert')
		.setDescription('Make an alert on the Emergency Alert System')
		.addStringOption((option) =>
			option
			.setName("content")
			.setDescription("The content of the alert. please open a new line by the expression \"\\n\"")
			.setRequired(true)
		),

  async execute(interaction) {
      let content = interaction.options.getString("content");

      const alert = await loadImage(alertPicURL);

      const canvas = createCanvas(alert.naturalWidth, alert.naturalHeight);
      const ctx = canvas.getContext('2d')
      ctx.drawImage(alert, 0, 0);

      ctx.font = `22px Sans`;

      ctx.fillStyle = '#333333';

      const lines = content.split("\\n")
      for (var i = 0; i<lines.length; i++)
        ctx.fillText(lines[i], 20, 95 + (i*25));

      const img = canvas.toBuffer();
      const file = new MessageAttachment(img, "file.png");
      await interaction.reply({ files: [file] });
  },
};