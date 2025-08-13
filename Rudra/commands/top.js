module.exports.config = {
    name: "top",
    version: "0.0.6",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "Top Server!",
    commandCategory: "group",
    usages: "[thread/user/money]",
    cooldowns: 5
};

module.exports.run = async ({ event, api, args, Currencies, Users }) => {
    const { threadID, messageID } = event;
    let option = parseInt(args[1]) || 10;
    if (isNaN(option) || option <= 0) return api.sendMessage("List length must be a number greater than 0", threadID, messageID);

    const fs = require("fs-extra");

    function expToLevel(point) {
        if (point < 0) return 0;
        return Math.floor((Math.sqrt(1 + (4 * point) / 3) + 1) / 2);
    }

    // ===== Top Users by Level =====
    if (args[0] == "user") {
        let all = await Currencies.getAll(['userID', 'exp']);
        all.sort((a, b) => b.exp - a.exp);

        let msgBody = '🏆 Top Users by Level:\n';
        for (let i = 0; i < Math.min(option, all.length); i++) {
            let user = all[i];
            let level = expToLevel(user.exp);
            let userData = await Users.getData(user.userID);
            msgBody += `${i + 1}. ${userData.name} - Level ${level}\n`;
        }

        return api.sendMessage(msgBody, threadID, messageID);
    }

    // ===== Top Threads by Messages =====
    if (args[0] == "thread") {
        let threadList = [];
        let data;
        try {
            data = await api.getThreadList(option + 10, null, ["INBOX"]);
        } catch (e) {
            console.log(e);
            return api.sendMessage("Error fetching thread list.", threadID, messageID);
        }

        for (const thread of data) {
            if (thread.isGroup) threadList.push({
                threadName: thread.name,
                threadID: thread.threadID,
                messageCount: thread.messageCount
            });
        }

        threadList.sort((a, b) => b.messageCount - a.messageCount);

        let msgBody = `🏆 Top ${Math.min(option, threadList.length)} Groups by Messages:\n`;
        for (let i = 0; i < Math.min(option, threadList.length); i++) {
            let t = threadList[i];
            msgBody += `${i + 1}. ${t.threadName || "No name"}\nTID: [${t.threadID}]\nMessages: ${t.messageCount}\n\n`;
        }

        return api.sendMessage(msgBody, threadID, messageID);
    }

    // ===== Top Users by Money =====
    if (args[0] == "money") {
        let all = await Currencies.getAll(['userID', 'money']);
        all.sort((a, b) => b.money - a.money);

        let msgBody = '💰 Top Richest Users:\n';
        for (let i = 0; i < Math.min(option, all.length); i++) {
            let user = all[i];
            let userData = await Users.getData(user.userID);
            msgBody += `${i + 1}. ${userData.name} - ${user.money}💵\n`;
        }

        return api.sendMessage(msgBody, threadID, messageID);
    }

    // ===== If no valid argument =====
    return api.sendMessage("Please use: +top [user/thread/money]", threadID, messageID);
};
