module.exports.config = {
  name: "help",
  version: "3.0.5",
  hasPermssion: 0,
  credits: "Edited by 𝑀𝑑 𝑇𝑎𝑚𝑖𝑚",
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

  // Bot Name & Prefix from config/global
  const botName = global.config.BOTNAME || "Obot";
  const botPrefix = global.config.PREFIX || "!";

  let msg = "📌 Command List\n\n";
  for (let cat in categories) {
    msg += `🔹 ${cat.toUpperCase()}\n   ${categories[cat].join(" ❖ ")}\n\n`;
  }

  msg += "━━━━━━━━━━━━━━━━━━━━━━\n";
  msg += `🤖 Bot Name   ──⫸ ꧁༺ ${botName} ༻꧂\n`;
  msg += `🔑 Bot Prefix ──⫸ [ ${botPrefix} ]\n`;
  msg += `👑 Bot Owner  ──⫸ 𝑀𝑑 𝑇𝑎𝑚𝑖𝑚`;

  return api.sendMessage(msg, threadID, async (error, info) => {
    if (autoUnsend) {
      await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
      return api.unsendMessage(info.messageID);
    }
  }, messageID);
};
  
