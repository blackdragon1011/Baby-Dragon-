const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Dhaka");

module.exports.config = {
  name: "joinNotification",
  eventType: ["log:subscribe"],
  version: "3.1",
  credits: "Md Tamim x ChatGPT",
  description: "Stylish join message for new members or when bot is added"
};

module.exports.run = async function({ event, api }) {
  const { threadID, logMessageData, author } = event;

  // Current Date & Time
  const date = moment().format("DD MMMM YYYY");
  const time = moment().format("hh:mm A");

  // Get group info (for group name + member count)
  let threadInfo = await api.getThreadInfo(threadID);
  let groupName = threadInfo.threadName || "Unnamed Group";
  let memberCount = threadInfo.participantIDs.length;

  // When bot is added
  if (logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    return api.sendMessage(
      `╔══❀•°❀°•❀══╗\n` +
      ` 🤖 𝑯𝒆𝒍𝒍𝒐 𝑬𝒗𝒆𝒓𝒚𝒐𝒏𝒆!\n` +
      `╚══❀•°❀°•❀══╝\n\n` +
      `✨ 𝑰 𝒂𝒎 𝒚𝒐𝒖𝒓 𝒏𝒆𝒘 𝒈𝒓𝒐𝒖𝒑 𝒂𝒔𝒔𝒊𝒔𝒕𝒂𝒏𝒕!\n` +
      `👑 𝑴𝒚 𝑶𝒘𝒏𝒆𝒓: 𝐌𝐝 𝐓𝐚𝐦𝐢𝐦\n` +
      `🏡 𝑮𝒓𝒐𝒖𝒑: ${groupName}\n` +
      `👥 𝑻𝒐𝒕𝒂𝒍 𝑴𝒆𝒎𝒃𝒆𝒓𝒔: ${memberCount}\n` +
      `📅 𝑫𝒂𝒕𝒆: ${date}\n` +
      `⏰ 𝑻𝒊𝒎𝒆: ${time}\n\n` +
      `💡 Type 'help2' to see my commands.`,
      threadID
    );
  }

  // When new members join
  let mentions = [];
  let nameList = logMessageData.addedParticipants.map(info => {
    mentions.push({
      tag: info.fullName,
      id: info.userFbId
    });
    return `✨ ${info.fullName} ✨`;
  });

  // Who added them
  let addedByName;
  try {
    let adderInfo = await api.getUserInfo(author);
    addedByName = adderInfo[author].name;
  } catch (e) {
    addedByName = "Unknown";
  }

  // New total members
  let newMemberCount = memberCount;

  const msg =
    `╔════•ೋೋ•════╗\n` +
    ` 🎉 𝑾𝒆𝒍𝒄𝒐𝒎𝒆 🎉\n` +
    `╚════•ೋೋ•════╝\n\n` +
    `💖 ${nameList.join(", ")} 💖\n\n` +
    `📅 𝑫𝒂𝒕𝒆: ${date}\n` +
    `⏰ 𝑻𝒊𝒎𝒆: ${time}\n` +
    `👤 𝑨𝒅𝒅𝒆𝒅 𝒃𝒚: ${addedByName}\n` +
    `🏡 𝑮𝒓𝒐𝒖𝒑: ${groupName}\n` +
    `👥 𝑴𝒆𝒎𝒃𝒆𝒓 𝑵𝒐: ${newMemberCount}\n\n` +
    `🚀 We're so glad to have you here!\n` +
    `📜 Please follow the rules & enjoy your stay.`;

  api.sendMessage({ body: msg, mentions }, threadID);
};
