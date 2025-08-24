module.exports.config = {
  name: "help",
  version: "3.0.4",
  hasPermssion: 0,
  credits: "Edited by 𝓜𝓭 𝓣𝓪𝓶𝓲𝓶 ✧",
  description: "Show all commands with categories (stylish, fancy)",
  commandCategory: "system",
  usages: "[commandName]",
  cooldowns: 1,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 300
  }
};

module.exports.run = function({ api, event, args }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];

  const command = commands.get((args[0] || "").toLowerCase());

  // যদি নির্দিষ্ট কমান্ড দেওয়া হয়
  if (command) {
    return api.sendMessage(
      `「 ${command.config.name} 」\n${command.config.description}\n\n❯ Usage: ${command.config.name} ${(command.config.usages) ? command.config.usages : ""}\n❯ Category: ${command.config.commandCategory}\n❯ Waiting time: ${command.config.cooldowns} seconds\n❯ Permission: ${command.config.hasPermssion}\n\n» Module code by ${this.config.credits} «`,
      threadID,
      messageID
    );
  }

  // সব কমান্ড category-wise
  let categories = {};
  for (let [name, value] of commands) {
    let cat = value.config.commandCategory || "Other";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(name);
  }

  let msg = "📌 Command List\n\n";
  for (let cat in categories) {
    msg += `🔹 ${cat.toUpperCase()}\n   ${categories[cat].join(" ❖ ")}\n\n`;
  }

  msg += "━━━━━━━━━━━━━━━━━━━━━━\n";
  msg += "🤖 Bot Name   ──⫸ ꧁༺ Hinata ༻꧂\n";
  msg += "🔑 Bot Prefix ──⫸ [ + ]\n";
  msg += "👑 Bot Owner  ──⫸ ꧁𓊈𒆜 𝓜𝓭 𝓣𝓪𝓶𝓲𝓶 ✧ 𒆜𓊉꧂";

  return api.sendMessage(msg, threadID, async (error, info) => {
    if (autoUnsend) {
      await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
      return api.unsendMessage(info.messageID);
    }
  }, messageID);
};
  
