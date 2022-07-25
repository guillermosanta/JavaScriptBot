const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { whitelistChannel } = require("../utils/db");

exports.data = new SlashCommandBuilder()
  .setName("whitelist")
  .setDescription(`Removes a channel from the blacklisted list`)
  .addChannelOption((option) =>
    option.setName("channel").setDescription("The channel to be whitelisted").setRequired(true)
  )
  .setDMPermission(false)
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

exports.execute = async (interaction) => {
  const { options, guild } = interaction;
  const { value: channelId } = options.get("channel");
  const res = await whitelistChannel(guild.id, channelId);
  if (res === false) {
    interaction.reply({ content: "This channel is not blacklisted", ephemeral: true });
  } else {
    interaction.reply({ content: `<#${channelId}> is now whitelisted`, ephemeral: true });
  }
};
