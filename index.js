const { ActivityType } = require("discord.js");

const client = require("./client/build-client.js");
const run = require("./run.js");
const { getBlacklistedChannels } = require("./utils/db.js");

client.once("ready", () => {
  client.user.setActivity("JavaScript", { type: ActivityType.Playing });
  console.log(`Coding session started 💻`);
});

client.on("messageCreate", async (message) => {
  const { content, guild, channel } = message;
  const regex = new RegExp(/```js\n\/\/\s*execute\n((.|\n)+)```/);
  const match = content.match(regex);
  if (!match) return;
  const blacklistedChannels = await getBlacklistedChannels(guild.id);
  if (blacklistedChannels.includes(channel.id)) {
    message.reply({
      content: "I cannot execute your code in this channel because it is blacklisted",
      ephemeral: true,
    });
  } else {
    const code = match[1].split(";");
    run(code, message);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const { commandName } = interaction;
  const command = client.commands.get(commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: "There was an error while executing this command", ephemeral: true });
  }
});
