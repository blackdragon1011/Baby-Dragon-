module.exports.config = {
  name: "unfriend",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Arun Kumar edited by saim",
  description: "Remove friends by UID or all",
  commandCategory: "system",
  usages: "[uid/all]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const uid = args[0];
  if (!uid) return api.sendMessage("Please provide a UID or type 'all'.", event.threadID, event.messageID);

  if (uid.toLowerCase() === "all") {
    try {
      const friends = await api.getFriendsList();
      let count = 0;
      for (const friend of friends) {
        try {
          await api.unfriend(friend.userID);
          count++;
        } catch (err) {
          console.log(`❌ Error removing ${friend.userID}: ${err.message}`);
        }
      }
      return api.sendMessage(`✅ All friends removed. Total: ${count}`, event.threadID, event.messageID);
    } catch (e) {
      return api.sendMessage("❌ Error fetching friends list.", event.threadID, event.messageID);
    }
  } else {
    try {
      await api.unfriend(uid);
      return api.sendMessage(`✅ UID ${uid} has been unfriended.`, event.threadID, event.messageID);
    } catch (err) {
      return api.sendMessage(`❌ Error unfriending: ${err.message}`, event.threadID, event.messageID);
    }
  }
};
