const { QuickDB } = require("quick.db");
const db = new QuickDB();

const getBlacklistedChannels = async (guildId) => {
  const channels = await db.get(guildId);
  return channels || [];
};

const setBlacklistedChannels = async (guildId, channels) => {
  db.set(guildId, channels);
};

const blacklistChannel = async (guildId, channelId) => {
  const channels = await getBlacklistedChannels(guildId);
  if (!Array.isArray(channels)) channels = [channelId];
  else {
    if (channels.includes(channelId)) return false;
    else channels.push(channelId);
  }
  setBlacklistedChannels(guildId, channels);
};

const whitelistChannel = async (guildId, channelId) => {
  const channels = await getBlacklistedChannels(guildId);
  if (!Array.isArray(channels) || !channels.includes(channelId)) return false;
  channels.splice(channels.indexOf(channelId), 1);
  setBlacklistedChannels(guildId, channels);
};

module.exports = {
  getBlacklistedChannels,
  setBlacklistedChannels,
  blacklistChannel,
  whitelistChannel,
};
