module.exports.config = {
  name: "anime1",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 | Fixed by Tamim",
  description: "Convert image into anime style",
  commandCategory: "editing",
  usages: "reply with image or give image URL",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require('axios');
  const fs = require('fs-extra');
  const pathie = __dirname + `/cache/animefy.jpg`;
  const { threadID, messageID } = event;

  let imageUrl;

  // Check if user replied to an image
  if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments[0]) {
    imageUrl = event.messageReply.attachments[0].url;
  } else if (args[0]) {
    imageUrl = args.join(" ");
  } else {
    return api.sendMessage("⚠️ Please reply to an image or give an image URL.", threadID, messageID);
  }

  try {
    // First API call
    const lim = await axios.get(`https://animeify.shinoyama.repl.co/convert-to-anime?imageUrl=${encodeURIComponent(imageUrl)}`);
    const image = lim.data.urls?.[1] || lim.data.urls?.[0]; // fallback if 2nd url missing
    if (!image) return api.sendMessage("❌ Failed to get anime image from API.", threadID, messageID);

    // Second API call
    const img = (await axios.get(`https://www.drawever.com${image}`, { responseType: "arraybuffer" })).data;

    fs.writeFileSync(pathie, Buffer.from(img, 'binary'));

    api.sendMessage({
      body: "✅ Here is your anime-style image:",
      attachment: fs.createReadStream(pathie)
    }, threadID, () => fs.unlinkSync(pathie), messageID);

  } catch (e) {
    api.sendMessage(`❌ Error occurred:\n${e.message}`, threadID, messageID);
  }
};
      
