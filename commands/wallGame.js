const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const WallGameStats = require("../models/wallGameStats");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wall-game')
		.setDescription('wall game against someone')
		.addSubcommand(subcommand => 
			subcommand
			.setName('play')
			.setDescription('Play wall game')
			.addUserOption((option) =>
				option
				.setName("user")
				.setDescription("who you want to fu*k")
				.setRequired(true)))
		.addSubcommand(subcommand => 
			subcommand
			.setName('reset')
			.setDescription('Resets wall game in if there are any crashes.')),
	async execute(interaction) {
		const guildId = interaction.guildId;
		if (interaction.options.getSubcommand() === 'reset') {
			await WallGameStats.findOneAndUpdate({
				guildId: guildId
			}, {
				$set: {
					isPlaying: false,
				}
			}, {
				new: true,
				upsert: true
			})
			await interaction.reply("Wall game has been reset.");
		}
		if (interaction.options.getSubcommand() === 'play') {
			const channel = interaction.member.guild.channels.cache.get(interaction.channelId);
			// Initialize the game
			let wallGameStats = await WallGameStats.findOneAndUpdate({ guildId: guildId }, {}, { new: true, upsert: true });
			const isPlaying = wallGameStats.isPlaying;
			if (!isPlaying) {
				await WallGameStats.findOneAndUpdate({
					guildId: guildId
				}, {
					$set: {
						playersJoined: 0,
						score: 0,
						isPlaying: true,
					}
				}, {
					new: true,
					upsert: true
				});
				
				const target = interaction.options.getUser("user");
				const targetName = target.username;
				const peititonMaker = interaction.user.username;
				const peititonMakerIcon = interaction.user.displayAvatarURL({ format: "jpg" });
				const embed = new MessageEmbed()
								.setColor('#9FCEA9')
								.setTitle(`Wall game on walling ${targetName}`)
								.setDescription('You have 20 seconds wall them!')
								.setFooter({ text: `Petition by ${peititonMaker}, walled 0 times.`, iconURL: peititonMakerIcon});
				const row = new MessageActionRow()
								.addComponents(
									new MessageButton()
										.setCustomId('wall')
										.setLabel('Wall')
										.setStyle('PRIMARY'),
								);

				// This line is to prevent "The application did not respond" error
				// A better solution will be concluded later
				await interaction.reply({ content: `Time to wall ${target}! Everyone, assemble!`});
				channel.send({ embeds: [embed], components: [row] })
				.then(async (gameNotice) => {
					const filter = i => i.customId === 'wall';
					const collector = interaction.channel.createMessageComponentCollector({ filter, time: 20000 });
					
					collector.on('collect', async (i) => {
						i.deferUpdate();
						if (i.user === target) {
							return; // You can't wall yourself
						}
						const currentStats = await WallGameStats.findOneAndUpdate({ guildId: guildId }, {}, { new: true, upsert: true })
						const currentTimesWalled = currentStats.score + 1;
						await WallGameStats.findOneAndUpdate({
							guildId: guildId
						}, {
							$set: {
								score: currentTimesWalled,
							}
						}, {
							new: true,
							upsert: true
						});
						const newEmbed = new MessageEmbed()
										.setColor('#9FCEA9')
										.setTitle(`Wall game on walling ${targetName}`)
										.setDescription('You have 20 seconds wall them!')
										.setFooter({ text: `Petition by ${peititonMaker}, walled ${currentTimesWalled} times.`, iconURL: peititonMakerIcon});
						await gameNotice.edit({ embeds: [newEmbed] });				
					});
					collector.on('end', async (i) => {
						const currentStats = await WallGameStats.findOneAndUpdate({ guildId: guildId }, {}, { new: true, upsert: true })
						const score = currentStats.score;
						let highScore = currentStats.highScore;
						let desc = "What a fine meat sauce!";
						if (highScore < score) {
							await WallGameStats.findOneAndUpdate({
								guildId: guildId
							}, {
								$set: {
									highScore: score,
								}
							}, {
								new: true,
								upsert: true
							});
							desc = "Wow! a new highscore!";
							highScore = score;
						}
						if (score === 0) {
							desc = "Come on! it is not even a meat sauce!"
						}
						const resultEmbed = new MessageEmbed()
										.setColor('#9FCEA9')
										.setTitle(`Wall game on walling ${targetName}`)
										.setDescription(desc)
										.addFields(
											{ name: "Score", value: `${score}`, inline: true },
											{ name: "Server Best", value: `${highScore}`, inline: true }
										);
						await gameNotice.edit({ embeds: [resultEmbed], components: [] });
						await WallGameStats.findOneAndUpdate({
							guildId: guildId
						}, {
							$set: {
								isPlaying: false,
							}
						}, {
							new: true,
							upsert: true
						});
					});
				});
			} else {
				await interaction.reply({ content: "Please wait for the current wall game ends!" })
			}
		}
	},
};