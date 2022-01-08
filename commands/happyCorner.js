const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas')
const happyCornerPicURL = __dirname + '/../public/images/happy_corner.jpg'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('happy-corner')
		.setDescription('con someone')
		.addUserOption((option) =>
			option
			.setName("user")
			.setDescription("who you want to con")
			.setRequired(true)
		),
	async execute(interaction) {
		const target = interaction.options.getUser("user");
        
        const happyCornerPic = await loadImage(happyCornerPicURL);
        const avatar = await loadImage(`${target.displayAvatarURL({ format: "jpg" })}?size=100`);

        const canvas = createCanvas(happyCornerPic.naturalWidth, happyCornerPic.naturalHeight);
        const ctx = canvas.getContext('2d')
        ctx.drawImage(happyCornerPic, 0, 0);
        ctx.drawImage(avatar, 255, 65, 100, 100);

        const img = canvas.toBuffer();
        const file = new MessageAttachment(img, "file.png");
		await interaction.reply({ files: [file] });
	},
};