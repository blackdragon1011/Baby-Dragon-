const axios = require('axios');
const fs = require('fs');
const path = require('path');

const apiURL = "https://smfahim.xyz/gedit";

module.exports.config = {
  name: "refine",
  version: "6.9",
  credits: "API Fahim mode by Tamim",
  countDown: 5,
  hasPermssion: 1,
  category: "AI",
  commandCategory: "AI",
  description: "AI দিয়ে ছবি edit করা",
  guide: {
    en: "Reply to an image with {pn} [prompt]"
  }
};

async function handleEdit(api, event, args) {
  const url = event.messageReply?.attachments?.[0]?.url;
  const prompt = args.join(" ") || "What is this?";

  if (!url) return api.sendMessage("❌ দয়া করে একটি ছবির reply দিন।", event.threadID, event.messageID);

  try {
    const response = await axios.get(
      `${apiURL}?prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(url)}`,
      { responseType: 'arraybuffer', validateStatus: () => true }
    );

    const contentType = response.headers['content-type'];

    if (contentType?.startsWith('image/')) {
      const tempPath = path.join(__dirname, `temp_${Date.now()}.png`);
      fs.writeFileSync(tempPath, response.data);

      await api.sendMessage({ attachment: fs.createReadStream(tempPath) }, event.threadID, event.messageID);

      fs.unlinkSync(tempPath); // ছবিটি পাঠানোর পর ডিলিট হয়ে যায়
    } else {
      const jsonText = response.data.toString();
      const jsonData = JSON.parse(jsonText);
      if (jsonData?.response) return api.sendMessage(jsonData.response, event.threadID, event.messageID);

      return api.sendMessage("❌ API থেকে কোনো বৈধ response পাওয়া যায়নি।", event.threadID, event.messageID);
    }
  } catch (err) {
    console.error("Refine command error:", err);
    return api.sendMessage("❌ Request process করতে ব্যর্থ। পরে চেষ্টা করুন।", event.threadID, event.messageID);
  }
}

module.exports.run = async ({ api, event, args }) => {
  if (!event.messageReply) return api.sendMessage("❌ দয়া করে একটি ছবির reply দিন।", event.threadID, event.messageID);
  await handleEdit(api, event, args);
};

module.exports.handleReply = async ({ api, event, args }) => {
  if (event.type === "message_reply") await handleEdit(api, event, args);
};
