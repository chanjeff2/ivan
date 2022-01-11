const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas')
const spookPicURL = __dirname + '/../public/images/spook.jpg'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spook')
		.setDescription('Spook someone to their sh*t out of the pants')
		.addUserOption((option) =>
			option
			.setName("user")
			.setDescription("who you want to spook")
			.setRequired(true)
		),
    async execute(interaction) {
        const target = interaction.options.getUser("user");

        let FinalTarget = target;
        let line = `${target}, BOO!`;
        if (target.id === process.env.CLIENT_ID) {
            FinalTarget = interaction.user;
            line = `${interaction.user}, you dare to use my own spells against me, Potter? **I shall spook you till your heart is still!**`;
        }
        const spookPic = await loadImage(spookPicURL);
        const avatar = await loadImage(`${FinalTarget.displayAvatarURL({ format: "jpg" })}?size=100`);

        const canvas = createCanvas(spookPic.naturalWidth, spookPic.naturalHeight);
        const ctx = canvas.getContext('2d')
        ctx.drawImage(spookPic, 0, 0);
        ctx.drawImage(avatar, 290, 125, 225, 225);

        const img = canvas.toBuffer();
        const file = new MessageAttachment(img, "file.png");
        await interaction.reply({ content: line, files: [file] });
    },
};