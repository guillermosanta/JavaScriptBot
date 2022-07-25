const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { blacklistChannel } = require("../utils/db");

exports.data = new SlashCommandBuilder()
  .setName("blacklist")
  .setDescription(`See the settings of the bot`)
  .addChannelOption((option) =>
    option.setName("channel").setDescription("The channel to be blacklisted").setRequired(true)
  )
  .setDMPermission(false)
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

exports.execute = async (interaction) => {
  const { options, guild } = interaction;
  const { value: channelId } = options.get("channel");
  const res = await blacklistChannel(guild.id, channelId);
  if (res === false) {
    interaction.reply({ content: "This channel is already blacklisted", ephemeral: true });
  } else {
    interaction.reply({ content: `<#${channelId}> is now blacklisted`, ephemeral: true });
  }
};
