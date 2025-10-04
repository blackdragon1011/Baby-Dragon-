const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Dhaka");

module.exports.config = {
  name: "welcome",
  eventType: ["log:subscribe"],
  version: "6.0.0",
  author: "MD Tamim",
  description: "Stylish welcome with detailed ChatBot info",
  category: "Group"
};

module.exports.run = async function({ api, event }) {
  try {
    if (event.logMessageType === "log:subscribe") {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const groupName = threadInfo.threadName || "Unknown Group";
      const groupMembers = threadInfo.participantIDs.length;
      const added = event.logMessageData.addedParticipants;
      const now = moment().format("dddd, MMMM Do YYYY, h:mm A");

      for (let user of added) {
        const msg = `
╔════════✦✧✦════════╗
        ✨ 𝓦𝓔𝓛𝓒𝓞𝓜𝓔 ✨
╚════════✦✧✦════════╝

👤 𝐇𝐞𝐥𝐥𝐨 ${user.fullName}  
🏰 𝐆𝐫𝐨𝐮𝐩 ➤ ${groupName}  
👥 𝐓𝐨𝐭𝐚𝐥 𝐌𝐞𝐦𝐛𝐞𝐫𝐬 ➤ ${groupMembers}  
⏰ 𝐉𝐨𝐢𝐧𝐞𝐝 𝐀𝐭 ➤ ${now}  

🤖 𝐈 𝐚𝐦 𝐀𝐈 𝐂𝐡𝐚𝐭𝐁𝐨𝐭  
👑 𝐎𝐰𝐧𝐞𝐝 𝐛𝐲 ➤ 𝐌𝐃 𝐓𝐚𝐦𝐢𝐦  

━━━━━━━━━━━━━━━
📌 𝑰𝒏𝒇𝒐:  
✅ আমি একটি *চ্যাটবট রোবট* 🤖  
✅ আমার কাজ হলো তোমাদের সাথে কথা বলা 🗣️  
✅ মজা দেওয়া, সাহায্য করা আর এন্টারটেইন করা 🎭  
✅ আমি ২৪/৭ অনলাইনে থাকি ⏰  
✅ মালিক আমাকে সবসময় নতুন ফিচার দেয় 💡  

━━━━━━━━━━━━━━━
        `;

        api.sendMessage(msg, event.threadID);
      }
    }
  } catch (err) {
    // error হলে কিছুই show করবে না, শুধু console এ log হবে
    console.log("Welcome Command Error:", err.message);
  }
};
