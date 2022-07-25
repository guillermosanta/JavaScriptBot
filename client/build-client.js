require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname + "/../commands");
fs.readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"))
  .forEach((file) => {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
  });

client.login(process.env.BOT_TOKEN);
module.exports = client;
