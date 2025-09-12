module.exports.config = {
  name: "goiadmin",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
  description: "Bot will rep ng tag admin or rep ng tagbot ",
  commandCategory: "Other",
  usages: "",
  cooldowns: 1
};
module.exports.handleEvent = function({ api, event }) {
  if (event.senderID !== "100091383161288") {
    var aid = ["100091383161288"];
    for (const id of aid) {
    if ( Object.keys(event.mentions) == id) {
      var msg = ["Oni to busy achen amake bolo ki bolbe?", "Ki holo boss ke daku kn?", "boss maybe busy ache", "   Boss maybe chole geche"];
      return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);
    }
    }}
};
module.exports.run = async function({}) {
        }
