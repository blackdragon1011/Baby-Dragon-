module.exports.config = {
  name: "help",
  version: "3.0.3",
  hasPermssion: 0,
  credits: "Edited by 𝕄𝕕 𝕋𝕒𝕞𝕚𝕞",
  description: "Show all commands with categories (stylish, no prefix)",
  commandCategory: "system",
  usages: "[commandName]",
  cooldowns: 1,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 300
  }
};

module.exports.languages = {
  "en": {
    "moduleInfo": "「 %1 」\n%2\n\n❯ Usage: %3\n❯ Category: %4\n❯ Waiting time: %5 seconds(s)\n❯ Permission: %6\n\n» Module code by %7 «",
    "user": "User",
    "adminGroup": "Admin group",
    "adminBot": "Admin bot"
  }
};

module.exports.run = function({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];

  const command = commands.get((args[0] || "").toLowerCase());

  // নির্দিষ্ট কমান্ড দিলে details দেখাবে
  if (command) {
    return api.sendMessage(
      getText("moduleInfo",
        command.config.name,
        command.config.description,
        `${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`,
        command.config.commandCategory,
        command.config.cooldowns,
        ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")),
        command.config.credits
      ),
      threadID,
      messageID
    );
  }

  // সব কমান্ড category-wise (no prefix)
  let categories = {};
  for (let [name, value] of commands) {
    let cat = value.config.commandCategory || "Other";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(name);
  }

  let msg = "📌 Command List\n\n";
  for (let cat in categories) {
    msg += `🔹 ${cat.toUpperCase()}: ${categories[cat].join(" ✦ ")}\n`;
  }

  msg += "\n━━━━━━━━━━━━━━━━━━\n🤖 Bot Owner ──⫸ 𝕄𝕕 𝕋𝕒𝕞𝕚𝕞 ✨";

  return api.sendMessage(msg, threadID, async (error, info) => {
    if (autoUnsend) {
      await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
      return api.unsendMessage(info.messageID);
    }
  }, messageID);
};
