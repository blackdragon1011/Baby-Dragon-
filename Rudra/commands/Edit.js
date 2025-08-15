const axios = require("axios");

module.exports.config = {
  name: "editimg",
  version: "1.0",
  description: "Reply to an image to edit it with AI",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args, message }) {
  const prompt = args.join(" ");

  // যদি ইউজার prompt না দেয়
  if (!prompt) {
    const sentMsg = await message.reply("𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚙𝚛𝚘𝚖𝚙𝚝");
    // Reply handle করার জন্য global map
    global.onReply = global.onReply || new Map();
    global.onReply.set(sentMsg.messageID, {
      type: "prompt",
      author: event.senderID,
      commandName: this.config.name
    });
    return;
  }

  const sentMsg = await message.reply("𝙽𝚘𝚠 𝚙𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚠𝚒𝚝𝚑 𝚊𝚗 𝚒𝚖𝚊𝚐𝚎");
  global.onReply = global.onReply || new Map();
  global.onReply.set(sentMsg.messageID, {
    type: "image",
    prompt: prompt,
    author: event.senderID,
    commandName: this.config.name
  });
};

module.exports.onReply = async function({ api, event, message, Reply }) {
  const { type, prompt, author } = Reply;

  if (event.senderID !== author)
    return message.reply("𝙾𝚗𝚕𝚢 the user who started this command can reply");

  if (!event.messageReply?.attachments?.length)
    return message.reply("𝙿𝚕𝚎𝚊𝚜𝚎 reply with a photo");

  const attachment = event.messageReply.attachments[0];
  if (attachment.type !== "photo")
    return message.reply("𝙿𝚕𝚎𝚊𝚜𝚎 reply with a photo");

  await processEdit(message, prompt, attachment.url);
  // reply map থেকে remove করা
  global.onReply.delete(event.messageID);
};

async function processEdit(message, prompt, imageUrl) {
  try {
    const apiUrl = `https://rasin-x-apis.onrender.com/api/rasin/edit?prompt=${encodeURIComponent(
      prompt
    )}&url=${encodeURIComponent(imageUrl)}&apikey=rs_jgcrn577-hh4x-358p-9na9-vf`;

    const res = await axios.get(apiUrl);
    const resultImageUrl = res.data.img_url;

    if (!resultImageUrl) return message.reply("No image returned 😐");

    await message.reply({ attachment: resultImageUrl });
  } catch (err) {
    console.error(err);
    message.reply("Failed 💔");
  }
}
