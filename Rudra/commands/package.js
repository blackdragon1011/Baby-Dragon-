module.exports.config = {
  name: "package",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Tamim", // attribution comment, functionally changeable
  description: "Show bot package info in premium style",
  commandCategory: "system",
  cooldowns: 1,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID } = event;

  // Bot info – তুমি চাইলে এখান থেকে নিজের নাম দিয়ে modify করতে পারো
  const botInfo = {
    name: args[0] || "HinataBot",
    version: "1.0.2",
    description: "A simple Facebook Messenger Bot made by Tamim",
    author: args[1] || "Tamim",
    license: "GPL-3.0",
    repository: "https://github.com/Tamimkot2324/Tamim-project"
  };

  // Premium styled message
  const bodyMsg = `💎 Bot Package Info 💎
━━━━━━━━━━━━━━━━━━
📝 Name: ${botInfo.name}
🔖 Version: ${botInfo.version}
👤 Author: ${botInfo.author}
📖 Description: ${botInfo.description}
⚖️ License: ${botInfo.license}
🌐 Repository: ${botInfo.repository}
━━━━━━━━━━━━━━━━━━
💡 Keep customizing and become a premium bot!`;

  const imageLink = ["https://i.imgur.com/6UxTLqh.png"]; // sample image
  const imgPath = __dirname + "/cache/package.png";

  // Download random image and send message
  const callback = () => {
    api.sendMessage(
      { body: bodyMsg, attachment: fs.createReadStream(imgPath) },
      threadID,
      () => fs.unlinkSync(imgPath),
      messageID
    );
  };

  request(encodeURI(imageLink[Math.floor(Math.random() * imageLink.length)]))
    .pipe(fs.createWriteStream(imgPath))
    .on("close", () => callback());
};
