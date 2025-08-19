const axios = require("axios");
const { getStreamFromURL } = global.utils || require('./utils');

const onReplyMap = new Map();

module.exports = {
  config: {
    name: "editimage",
    version: "1.0",
    author: "Converted by ChatGPT",
    description: "Edit an image using a prompt",
    category: "image"
  },

  onStart: async function ({ message, event }) {
    const sentMsg = await message.reply("𝙿𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚠𝚒𝚝𝚑 𝚊 𝚙𝚛𝚘𝚖𝚙𝚝");

    onReplyMap.set(sentMsg.messageID, {
      type: "prompt",
      author: event.senderID
    });
  },

  onReply: async function ({ message, event }) {
    const replyData = onReplyMap.get(event.messageReply.messageID);
    if (!replyData) return;

    const { type, author, prompt } = replyData;
    if (event.senderID !== author)
      return message.reply("Only the user who initiated this command can reply.");

    if (type === "prompt") {
      const userPrompt = event.body.trim();
      if (!userPrompt) return message.reply("𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚙𝚛𝚘𝚖𝚙𝚝");

      const sentMsg = await message.reply("𝙽𝚘𝚠 𝚙𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚠𝚒𝚝𝚑 𝚊𝚗 𝚒𝚖𝚊𝚐𝚎");

      onReplyMap.set(sentMsg.messageID, {
        type: "image",
        prompt: userPrompt,
        author: event.senderID
      });

      return;
    }

    if (type === "image") {
      const attachment = event.messageReply?.attachments?.[0];
      if (!attachment || attachment.type !== "photo")
        return message.reply("𝙿𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚠𝚒𝚝𝚑 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚒𝚖𝚊𝚐𝚎");

      await processEdit({ message, event, prompt, imageUrl: attachment.url });
    }

    if (type === "continue_edit") {
      const newPrompt = event.body.trim();
      if (!newPrompt) return message.reply("𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚎𝚍𝚒𝚝 𝚙𝚛𝚘𝚖𝚙𝚝");

      const attachment = event.messageReply?.attachments?.[0];
      if (!attachment || attachment.type !== "photo")
        return message.reply("𝙿𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚒𝚖𝚊𝚐𝚎");

      await processEdit({ message, event, prompt: newPrompt, imageUrl: attachment.url });
    }

    onReplyMap.delete(event.messageReply.messageID);
  }
};

async function processEdit({ message, event, prompt, imageUrl }) {
  try {
    await message.react("⏳");

    const rasin = `https://rasin-x-apis.onrender.com/api/rasin/edit?prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(imageUrl)}&apikey=rs_jgcrn577-hh4x-358p-9na9-vf`;

    const res = await axios.get(rasin);
    const resultImageUrl = res.data.img_url;

    if (!resultImageUrl) return message.reply("𝙽𝚘 𝚒𝚖𝚊𝚐𝚎 𝚛𝚎𝚝𝚞𝚛𝚗𝚎𝚍 😐");

    const sentMsg = await message.reply({
      attachment: await getStreamFromURL(resultImageUrl)
    });

    onReplyMap.set(sentMsg.messageID, {
      type: "continue_edit",
      author: event.senderID
    });

    await message.react("🌸");
  } catch (err) {
    console.error(err);
    message.reply("𝙵𝚊𝚒𝚕𝚎𝚍 💔");
    await message.react("❌");
  }
}
