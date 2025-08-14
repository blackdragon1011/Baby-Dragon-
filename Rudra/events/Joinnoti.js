const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Dhaka");

module.exports.config = {
  name: "joinNotification",
  eventType: ["log:subscribe"],
  version: "3.0",
  credits: "Md Tamim x ChatGPT",
  description: "Stylish join message for new members or when bot is added"
};

module.exports.run = async function({ event, api }) {
  const { threadID, logMessageData } = event;

  // 🛠 Function to get current date & time
  const date = moment().format("DD MMMM YYYY");
  const time = moment().format("hh:mm A");

  // 🎯 When bot is added to the group
  if (logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    return api.sendMessage(
      `╔══❀•°❀°•❀══╗\n` +
      `  𝑯𝒆𝒍𝒍𝒐 𝑬𝒗𝒆𝒓𝒚𝒐𝒏𝒆! 🤖\n` +
      `╚══❀•°❀°•❀══╝\n\n` +
      `✨ 𝑰 𝒂𝒎 𝒚𝒐𝒖𝒓 𝒏𝒆𝒘 𝒈𝒓𝒐𝒖𝒑 𝒂𝒔𝒔𝒊𝒔𝒕𝒂𝒏𝒕, 𝒉𝒆𝒓𝒆 𝒕𝒐 𝒎𝒂𝒌𝒆 𝒕𝒉𝒊𝒏𝒈𝒔 𝒇𝒖𝒏 & 𝒆𝒂𝒔𝒚!\n` +
      `👑 𝑴𝒚 𝑶𝒘𝒏𝒆𝒓: 𝐌𝐝 𝐓𝐚𝐦𝐢𝐦\n` +
      `📅 𝑫𝒂𝒕𝒆: ${date}\n` +
      `⏰ 𝑻𝒊𝒎𝒆: ${time}\n\n` +
      `💡 𝑻𝒚𝒑𝒆 'help2' 𝒕𝒐 𝒔𝒆𝒆 𝒎𝒚 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒔.`,
      threadID
    );
  }

  // 👫 When new members join
  let mentions = [];
  let nameList = logMessageData.addedParticipants.map(info => {
    mentions.push({
      tag: info.fullName,
      id: info.userFbId
    });
    return `✨ ${info.fullName} ✨`;
  });

  const msg = 
    `╔════•ೋೋ•════╗\n` +
    `    🎉 𝑾𝒆𝒍𝒄𝒐𝒎𝒆 🎉\n` +
    `╚════•ೋೋ•════╝\n\n` +
    `💖 ${nameList.join(", ")} 💖\n\n` +
    `📅 𝑫𝒂𝒕𝒆 𝑱𝒐𝒊𝒏𝒆𝒅: ${date}\n` +
    `⏰ 𝑻𝒊𝒎𝒆: ${time}\n\n` +
    `🚀 𝑾𝒆’𝒓𝒆 𝒔𝒐 𝒈𝒍𝒂𝒅 𝒕𝒐 𝒉𝒂𝒗𝒆 𝒚𝒐𝒖 𝒉𝒆𝒓𝒆!\n` +
    `📜 𝑷𝒍𝒆𝒂𝒔𝒆 𝒇𝒐𝒍𝒍𝒐𝒘 𝒕𝒉𝒆 𝒓𝒖𝒍𝒆𝒔 & 𝒆𝒏𝒋𝒐𝒚 𝒚𝒐𝒖𝒓 𝒔𝒕𝒂𝒚.`;

  api.sendMessage({ body: msg, mentions }, threadID);
};
