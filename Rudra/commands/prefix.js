module.exports.config = {
  name: "prefix",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Tamim",
  description: "Show the bot prefix in a fully premium look",
  commandCategory: "system",
  usages: "",
  cooldowns: 5
};

module.exports.handleEvent = async ({ event, api, Threads }) => {
  const { threadID, messageID, body } = event;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  // Keywords that trigger prefix info
  const triggers = [
    "mpre","mprefix","prefix","dấu lệnh","prefix của bot là gì",
    "daulenh","duong","what prefix","freefix","what is the prefix",
    "bot dead","bots dead","where prefix","how to use bot",
    "bot not working","bot is offline","prefx","prfix","prifx","perfix"
  ];

  // Check if message matches any trigger
  if (triggers.some(t => t.toLowerCase() === body.toLowerCase())) {
    const infoMsg = `
╔══════════════════════╗
       💎 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗕𝗢𝗧 💎
╠══════════════════════╣
🖤 𝗣𝗿𝗲𝗳𝗶𝘅: [ ${prefix} ]
👑 𝗢𝗪𝗡𝗘𝗥: Md Tamim
🖤 𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲: Saim
😎 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: 
   https://www.facebook.com/niraba.anubhuti.126694?mibextid=ZbWKwL
╠══════════════════════╣
💡 𝗧𝗶𝗽𝘀:
• Use this prefix to interact with the bot.
• Enjoy all premium features!
• Invite friends to use the bot and spread fun!
╚══════════════════════╝
✨💖 Have a great day with your premium bot! 💖✨
`;

    return api.sendMessage(infoMsg, threadID, messageID);
  }
};

module.exports.run = async({ event, api }) => {
  return api.sendMessage("❌ Error: You need to ask properly to see the prefix!", event.threadID);
  }
