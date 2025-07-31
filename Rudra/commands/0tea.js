const fs = require("fs");
module.exports.config = {
  name: "tea",
    version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭", 
  description: "hihihihi",
  commandCategory: "no prefix",
  usages: "tea",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  var { threadID, messageID } = event;
  if (event.body.indexOf("tea")==0 || event.body.indexOf("Tea")==0 || event.body.indexOf("Chai")==0 || event.body.indexOf("CHAI")==0) {
    var msg = {
        body: "𝐞𝐢 𝐧𝐚𝐨 𝐛𝐛𝐲 𝐜𝐡𝐚 𝐤𝐡𝐚𝐨 𝐚𝐦𝐢 𝐛𝐚𝐧𝐚𝐢𝐜𝐡𝐢😊🎀",
        attachment: fs.createReadStream(__dirname + `/noprefix/tea.mp4`)
      }
      api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🫖", event.messageID, (err) => {}, true)
    }
  }
  module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
