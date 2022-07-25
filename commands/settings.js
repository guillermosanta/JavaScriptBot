const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { getBlacklistedChannels, setBlacklistedChannels } = require("../utils/db");

exports.data = new SlashCommandBuilder()
  .setName("settings")
  .setDescription(`See the settings of the bot`)
  .setDMPermission(false)
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

exports.execute = async (interaction) => {
  const { guild } = interaction;
  const blacklistedChannels = await getBlacklistedChannels(guild.id);

  const embed = {
    color: 0xf7df1e,
    title: `━ Settings for "${interaction.guild.name}" ━`,
    fields: [
      {
        name: `Blacklisted Channels: (${blacklistedChannels.length})`,
        value:
          blacklistedChannels.length === 0
            ? "None"
            : blacklistedChannels.map((channel) => `<#${channel}>`).join(" "),
      },
    ],
  };

  interaction.reply({ embeds: [embed] });
};
