module.exports.config = {
  name: "mentionbot",
  version: "1.0.0-beta-fixbyDungUwU",
  hasPermssion: 0,
  credits: "Fixed By Arun",
  description: "Bot will rep ng tag admin or rep ng tagbot ",
  commandCategory: "Other",
  usages: "",
  cooldowns: 1
};
module.exports.handleEvent = function({ api, event }) {
  if (event.senderID !== "61569892632784") {
    var aid = ["61569892632784","61569892632784"];
    for (const id of aid) {
    if ( Object.keys(event.mentions) == id) {
      var msg = ["Bot bole dakte paro na 🙁", "bot ba bby bol tobei reply dibo"," ami bason majhtechi 😒😓bot bole dak reply dibo",  "chup😒😒😒"];
      return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);
    }
    }}
};
module.exports.run = async function({}) {
        }
