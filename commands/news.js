const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const newsPicURL = __dirname + '/../public/images/news.png'

module.exports = {
	data: new SlashCommandBuilder()
		.setName('news')
		.setDescription('Publish a news on The Ivan7 News')
		.addStringOption((option) =>
			option
			.setName("title")
			.setDescription("the title of the news")
			.setRequired(true)
		)
        .addUserOption((option) => 
            option
            .setName("user")
            .setDescription("The user you want to add as picture of the news")
        )
        .addStringOption((option) =>
			option
			.setName("image-link")
			.setDescription("the link of image. Discord attachment link is recommended (Has higher priority than user icon)")
		),
    async execute(interaction) {
        const title = interaction.options.getString("title").toUpperCase();
        const user = interaction.options.getUser("user");
        const link = interaction.options.getString("image-link");

        const newspaper = await loadImage(newsPicURL);

        const canvas = createCanvas(newspaper.naturalWidth, newspaper.naturalHeight);
        const ctx = canvas.getContext('2d')
        ctx.drawImage(newspaper, 0, 0);
        let fontSize = 96;

        do {
            ctx.font = `bold ${fontSize -= 4}px arial`;
        } while (ctx.measureText(title).width > canvas.width - 70 && fontSize >= 48);

        ctx.fillStyle = '#535353';
        const centerLoc = (canvas.width/2 - ctx.measureText(title).width/2)
        ctx.fillText(title, centerLoc, 290);

        
        if (link && (link.endsWith("jpg") || link.endsWith("png"))) { // Add image if there are images required, png or jpg
            const image = await loadImage(link);
            ctx.drawImage(image, 435, 360, 510, 382);
        } else if (user) { // Add avatar if there are user mentioned
            const avatar = await loadImage(`${user.displayAvatarURL({ format: "jpg" })}?size=100`);
            ctx.drawImage(avatar, 515, 375, 350, 350);
        }

        const img = canvas.toBuffer();
        const file = new MessageAttachment(img, "file.png");
        await interaction.reply({ files: [file] });
    },
};