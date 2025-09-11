module.exports.config = {
    name: "ckbot",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Tamim",
    description: "Check User/Box/Admin stylish info",
    commandCategory: "Info",
    usages: "[user/box/admin]",
    cooldowns: 3,
    dependencies: {
        "request": "",
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.run = async ({ api, event, args }) => {
    const fs = require("fs-extra");
    const request = require("request");
    const axios = require("axios");

    // ========== HELP ==========
    if (args.length === 0) {
        return api.sendMessage(
`📌 You can use:

🔹 ckbot user → Get your info
🔹 ckbot user @[Tag] → Tagged user info
🔹 ckbot user <uid> → UID user info
🔹 ckbot box → Group info
🔹 ckbot admin → Admin info`, 
event.threadID, event.messageID);
    }

    // ========== BOX INFO ==========
    if (args[0] === "box") {
        let threadInfo = await api.getThreadInfo(event.threadID);
        let img = threadInfo.imageSrc;

        let males = threadInfo.userInfo.filter(u => u.gender === "MALE").length;
        let females = threadInfo.userInfo.filter(u => u.gender === "FEMALE").length;

        let pd = threadInfo.approvalMode ? "✅ On" : "❌ Off";
        let link = `https://fb.com/${event.threadID}`;

        let msg =
`╭───────────────⭓
│ 📛 Group: ${threadInfo.threadName}
│ 🆔 TID: ${event.threadID}
│ 🔗 Link: ${link}
│ ⚙️ Approval: ${pd}
│ 😀 Emoji: ${threadInfo.emoji}
│ 😃 Members: ${threadInfo.participantIDs.length}
│ 👑 Admins: ${threadInfo.adminIDs.length}
│ 🚹 Boys: ${males}
│ 🚺 Girls: ${females}
│ 💬 Messages: ${threadInfo.messageCount}
╰───────────────⭓`;

        if (!img) return api.sendMessage(msg, event.threadID, event.messageID);

        var callback = () => api.sendMessage(
            { body: msg, attachment: fs.createReadStream(__dirname + "/cache/box.png") },
            event.threadID,
            () => fs.unlinkSync(__dirname + "/cache/box.png"),
            event.messageID
        );
        return request(encodeURI(img))
            .pipe(fs.createWriteStream(__dirname + "/cache/box.png"))
            .on("close", () => callback());
    }

    // ========== ADMIN INFO ==========
    if (args[0] === "admin") {
        var callback = () => api.sendMessage(
            { body: `╭───────────────⭓\n│ 👑 ADMIN BOT INFO\n│\n│ 👤 Name: 𝐌𝐝 𝐓𝐚𝐦𝐢𝐦 🥲\n│ 🔗 Facebook: m.facebook.com/niraba.anubhuti.126694\n│ 💖 Thanks for using ${global.config.BOTNAME}!\n╰───────────────⭓`, attachment: fs.createReadStream(__dirname + "/cache/admin.png") },
            event.threadID,
            () => fs.unlinkSync(__dirname + "/cache/admin.png"),
            event.messageID
        );
        return request(encodeURI(`https://graph.facebook.com/100091383161288/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
            .pipe(fs.createWriteStream(__dirname + "/cache/admin.png"))
            .on("close", () => callback());
    }

    // ========== USER INFO ==========
    if (args[0] === "user") {
        let id;

        if (!args[1]) {
            id = event.type === "message_reply" ? event.messageReply.senderID : event.senderID;
        } else if (Object.keys(event.mentions).length > 0) {
            id = Object.keys(event.mentions)[0];
        } else {
            id = args[1];
        }

        let data = await api.getUserInfo(id);
        let user = data[id];

        // Extra info via Graph API
        let moreInfo;
        try {
            let res = await axios.get(`https://graph.facebook.com/${id}?fields=id,name,birthday,gender,link,locale,hometown,location,relationship_status,work,education,email&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
            moreInfo = res.data;
        } catch (e) {
            moreInfo = {};
        }

        let gender = user.gender == 2 ? "𓆩𝐂𝐮𝐭𝐞 𝐁𝐨𝐲𓆪" : user.gender == 1 ? "𓆩𝐂𝐮𝐭𝐞 𝐆𝐢𝐫𝐥𓆪" : "Unknown";
        let friend = user.isFriend ? "✅ Yes" : "❌ No";

        let msg =
`╭───────────────⭓
│ 👤 Name: ${moreInfo.name || user.name}
│ 🆔 UID: ${id}
│ 🎭 Username: ${user.vanity || "N/A"}
│ 🚻 Gender: ${gender}
│ 🤝 Friend with Bot: ${friend}
│ 🎂 Birthday: ${moreInfo.birthday || "Not Public"}
│ 🏡 Hometown: ${moreInfo.hometown?.name || "Not Public"}
│ 📍 Current City: ${moreInfo.location?.name || "Not Public"}
│ 💌 Relationship: ${moreInfo.relationship_status || "Not Public"}
│ 💼 Work: ${moreInfo.work ? moreInfo.work.map(w => w.employer?.name).join(", ") : "Not Public"}
│ 🏫 Education: ${moreInfo.education ? moreInfo.education.map(e => e.school?.name).join(", ") : "Not Public"}
│ 📧 Email: ${moreInfo.email || "Not Public"}
│ 🔗 Profile: ${moreInfo.link || user.profileUrl}
╰───────────────⭓`;

        var callback = () => api.sendMessage(
            { body: msg, attachment: fs.createReadStream(__dirname + "/cache/user.png") },
            event.threadID,
            () => fs.unlinkSync(__dirname + "/cache/user.png"),
            event.messageID
        );
        return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
            .pipe(fs.createWriteStream(__dirname + "/cache/user.png"))
            .on("close", () => callback());
    }
};
    
