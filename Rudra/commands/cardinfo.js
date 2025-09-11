const axios = require("axios");

module.exports.config = {
    name: "spy",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "Tamim",
    description: "Show Facebook user info in stylish front with tag",
    commandCategory: "The group",
    usages: "[reply/tag user]",
    cooldowns: 5
};

// Stylish front converter
const stylishFront = (text) => {
    return text.split("").map(c => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCharCode(code + 0x1D400 - 65); // A-Z
        if (code >= 97 && code <= 122) return String.fromCharCode(code + 0x1D41A - 97); // a-z
        return c;
    }).join("");
};

module.exports.run = async function({ api, event, args, Users }) {
    try {
        let uid;
        let mentions = {};

        if(event.type == "message_reply") {
            uid = event.messageReply.senderID;
            mentions[event.messageReply.senderID] = event.messageReply.senderName;
        } else if (Object.keys(event.mentions).length > 0) {
            uid = Object.keys(event.mentions)[0];
            mentions[uid] = event.mentions[uid];
        } else {
            uid = event.senderID;
            mentions[uid] = await Users.getName(uid);
        }

        const res = await api.getUserInfoV2(uid);

        const info = {
            Name: res.name || "Not Found",
            Gender: res.gender == "male" ? "Male" : res.gender == "female" ? "Female" : "Not public",
            Birthday: res.birthday || "Not Found",
            Relationship: res.relationship_status || "Not Found",
            Location: res.location || "Not Found",
            Follow: res.follow || "Not Found",
            Link: res.link || "Not Found",
            Hometown: res.hometown || "Not Found",
            Email: res.email || "Not Found",
            Religion: res.religion || "Not Found",
            Political: res.political || "Not Found",
            Website: res.website || "Not Found",
            Quotes: res.quotes || "Not Found",
            About: res.about || "Not Found"
        };

        let textOutput = `╭─❑ 𝗙𝗕 𝗨𝘀𝗲𝗿 𝗜𝗻𝗳𝗼 ❑─╮\n`;
        textOutput += `│ Mention: @${mentions[uid]}\n\n`;

        for (let key in info) {
            let value = key === "Birthday" ? info[key] : stylishFront(info[key]);
            textOutput += `│ ${stylishFront(key)}: ${value}\n`;
        }
        textOutput += "╰─────────────────────────────╯";

        return api.sendMessage({
            body: textOutput,
            mentions: [{ tag: mentions[uid], id: uid }]
        }, event.threadID, event.messageID);

    } catch (e) {
        console.error(e);
        return api.sendMessage("Error fetching user info.", event.threadID, event.messageID);
    }
};
      
