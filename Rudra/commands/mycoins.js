module.exports.config = {
  name: "bal",
  version: "3.5.0",
  hasPermssion: 0,
  credits: "Tamim",
  description: "Check the balance of yourself, mentioned user, or replied user",
  commandCategory: "economy",
  usages: "[Tag/Reply]",
  cooldowns: 5
};

// Format Dollar System (K, M, B, T)
function formatMoney(amount) {
  if (amount >= 1e12) return (amount / 1e12).toFixed(2) + "T";
  if (amount >= 1e9) return (amount / 1e9).toFixed(2) + "B";
  if (amount >= 1e6) return (amount / 1e6).toFixed(2) + "M";
  if (amount >= 1e3) return (amount / 1e3).toFixed(2) + "K";
  return amount.toString();
}

module.exports.languages = {
  "en": {
    "self": "💎 Balance Info 💎\n━━━━━━━━━━━━━━━\n👤 User: You 🫵\n💰 Balance: $%1\n━━━━━━━━━━━━━━━\n💡 Keep earning and become rich 💰",
    "mention": "💎 Balance Info 💎\n━━━━━━━━━━━━━━━\n👤 User: %1\n💰 Balance: $%2\n━━━━━━━━━━━━━━━\n💡 Keep earning and become rich 💰"
  }
}

module.exports.run = async function({ api, event, args, Currencies, getText }) {
  const { threadID, messageID, senderID, mentions, type, messageReply } = event;

  // If replied to someone
  if (type === "message_reply") {
    let uid = messageReply.senderID;
    let money = (await Currencies.getData(uid)).money || 0;
    return api.sendMessage({
      body: getText("mention", messageReply.senderID, formatMoney(money)),
      mentions: [{ tag: "User", id: uid }]
    }, threadID, messageID);
  }

  // If mentioned
  else if (Object.keys(mentions).length == 1) {
    let mention = Object.keys(mentions)[0];
    let money = (await Currencies.getData(mention)).money || 0;
    return api.sendMessage({
      body: getText("mention", mentions[mention].replace(/\@/g, ""), formatMoney(money)),
      mentions: [{ tag: mentions[mention].replace(/\@/g, ""), id: mention }]
    }, threadID, messageID);
  }

  // If no args => self
  else if (!args[0]) {
    let money = (await Currencies.getData(senderID)).money || 0;
    return api.sendMessage(getText("self", formatMoney(money)), threadID, messageID);
  }

  // Error
  else return global.utils.throwError(this.config.name, threadID, messageID);
	  }
	
