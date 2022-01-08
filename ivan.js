const { Client, Intents } = require("discord.js");
const dotenv = require('dotenv');
dotenv.config();

// create client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

// on bot ready/started
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
})

client.on("message", (message) => {
    // prevent self loop
    if (message.author == client.user) {
        return;
    }
    // replace "7" with "ivan"
    if (message.content.includes("7")) {
        message.reply(message.content.replace("7", " **Ivan** "));
    }
})

client.login(process.env.TOKEN);