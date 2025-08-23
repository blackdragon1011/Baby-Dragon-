const axios = require("axios");

module.exports = {
  config: {
    name: "remini",
    version: "1.4.1",
    author: "Raj (Translated by Tamim)",
    countDown: 5,
    role: 0,
    shortDescription: "রিপ্লাই করা ছবি enhance",
    longDescription: "রিপ্লাই করা ছবিকে Remini API দিয়ে enhance করে আবার পাঠাবে",
    category: "image",
    guide: {
      bn: "যে কোনো ছবিতে রিপ্লাই করে {pn} লিখো"
    }
  },

  onStart: async function ({ message, event }) {
    try {
      // check reply
      if (
        !event.messageReply ||
        !event.messageReply.attachments ||
        event.messageReply.attachments.length === 0
      ) {
        return message.reply("⚠️ কোনো ছবিকে reply করে তারপর command দাও!");
      }

      let attachment = event.messageReply.attachments[0];
      if (attachment.type !== "photo") {
        return message.reply("⚠️ শুধু ছবিকেই enhance করা যাবে।");
      }

      let imageUrl = attachment.url;
      const api = `https://api.princetechn.com/api/tools/remini?apikey=prince&url=${encodeURIComponent(imageUrl)}`;

      message.reply("⏳ আপনার ছবি enhance করা হচ্ছে...");

      const res = await axios.get(api);

      if (res.data?.result?.image_url) {
        let finalUrl = res.data.result.image_url;
        await message.reply({
          body: "✨ এখানে আপনার enhanced ছবি:",
          attachment: await global.utils.getStreamFromURL(finalUrl)
        });
      } else {
        message.reply("❌ API থেকে ছবির লিংক পাওয়া যায়নি।");
      }
    } catch (e) {
      console.error("Remini API error:", e.response?.data || e.message);
      message.reply("⚠️ ত্রুটি: " + (e.response ? JSON.stringify(e.response.data) : e.message));
    }
  }
};
