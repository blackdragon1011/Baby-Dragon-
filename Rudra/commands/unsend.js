module.exports.config = {
    name: "unsend",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "Remove the bot's message",
    commandCategory: "system",
    usages: "unsend",
    cooldowns: 0
};

module.exports.languages = {
    "en": {
        "returnCant": "Cannot unsend someone else's message.",
        "missingReply": "Reply to the message you want me to unsend.",
        "success": "Message unsent successfully!"
    }
}

module.exports.run = async function({ api, event, getText }) {
    const botID = api.getCurrentUserID();

    // যদি কমান্ড +u হয় এবং reply না করা থাকে
    if (event.body && event.body.toLowerCase() === "+u" && event.type !== "message_reply") {
        // bot-এর শেষ মেসেজ খুঁজে বের করা
        const messages = await api.getThreadHistory(event.threadID, 10, null);
        const lastBotMsg = messages.find(msg => msg.senderID === botID);
        if (!lastBotMsg) return api.sendMessage("No recent bot message to unsend.", event.threadID);
        return api.unsendMessage(lastBotMsg.messageID);
    }

    // সাধারণ reply ভিত্তিক unsend
    if (event.type != "message_reply") return api.sendMessage(getText("missingReply"), event.threadID, event.messageID);
    if (event.messageReply.senderID != botID) return api.sendMessage(getText("returnCant"), event.threadID, event.messageID);

    await api.unsendMessage(event.messageReply.messageID);
    return api.sendMessage(getText("success"), event.threadID, event.messageID);
}
