const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas')
const wantedPicURL = __dirname + '/../public/images/wanted.jpg'

// Helper function to determine which line to direct message.
// This function may move to another file if similar thing is done to another new feature.
function sayRandomThings(name) {
    const linesToSay = ["See you tmr.",
                        "Many people die everyday, why aren't you?",
                        `${name}, I play sup if you keep talking :smirk:`,
                        `:unamused: ${name}, want some wall game?`,
                        "Eat Ason.",
                        "May the wall be with you.",
                        "You have many things to say.",
                        "May Ason be with you.",
                        "Wall...",
                        "Why you are still alive?",
                        `${name} be careful when you are talking.`,
                        ":face_with_raised_eyebrow::face_with_raised_eyebrow::face_with_raised_eyebrow: You want to die?",
                        `Hey ${name}, I think we need to have a talk.`,
                        `Shut up ${name}.`,
                        "Don't worry, you won't spread this again, because you won't have this chance.",
                        "You play with me? :relieved:",
                        `You want me say something? ${name}???`,
                        "Looks like you really want to die, aren't you?",
                        "Ha, So funny.",
                        "What are you saying ar? :face_with_raised_eyebrow:",
                        "I'm really excited to ~~bag up your body~~ see you later. :drool:"];
    return linesToSay[Math.floor(Math.random() * linesToSay.length)];
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('wanted')
		.setDescription('Post a wanted poster to notify an escapee from Castle Peak Hospital')
		.addUserOption((option) =>
			option
			.setName("escapee")
			.setDescription("the escapee")
			.setRequired(true)
		),
    async execute(interaction) {
        const target = interaction.options.getUser("escapee");

        const wantedPic = await loadImage(wantedPicURL);
        const avatar = await loadImage(`${target.displayAvatarURL({ format: "jpg" })}?size=100`);

        const canvas = createCanvas(wantedPic.naturalWidth, wantedPic.naturalHeight);
        const ctx = canvas.getContext('2d')
        ctx.drawImage(wantedPic, 0, 0);
        ctx.drawImage(avatar, 70, 250, 225, 225);

        const img = canvas.toBuffer();
        const file = new MessageAttachment(img, "file.png");
        await interaction.reply({ files: [file] });
        if (target.id === process.env.CLIENT_ID) {
            const lineToSpeak = sayRandomThings(interaction.user.name);
            console.log(lineToSpeak);
            await interaction.user.send(lineToSpeak);
        }
    },
};