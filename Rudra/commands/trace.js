module.exports = {
  config: {
    name: "trace",
    version: "1.1",
    author: "Rudra + Tamim",
    cooldowns: 5,
    role: 0,
    shortDescription: { en: "Generate a tracking link for mentioned user" },
    category: "tools"
  },

  onStart: async function ({ api, event }) {
    try {
      const mentions = event.mentions;
      const mentionId = Object.keys(mentions)[0];
      if (!mentionId) return api.sendMessage("❌ Please mention someone to trace.", event.threadID, event.messageID);

      const name = mentions[mentionId];
      const link = `https://tracker-rudra.onrender.com/?uid=${mentionId}`;
      const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

      api.sendMessage({
        body: `🕵️‍♂️ 𝗦𝗮𝗶𝗺 𝑻𝒓𝒂𝒄𝒌 𝑳𝒊𝒏𝒌\n\n👤 Target: ${name}\n🔗 Link: ${link}\n🕒 Time: ${time}`,
        mentions: [{ id: mentionId, tag: name }]
      }, event.threadID, event.messageID);
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ An error occurred while generating the trace link.", event.threadID, event.messageID);
    }
  }
};
