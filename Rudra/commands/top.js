module.exports.config = {
    name: "top",
    version: "1.3.0",
    hasPermssion: 0,
    credits: "Tamim",
    description: "Premium Top List (Users, Threads, Money) without credits",
    commandCategory: "group",
    usages: "[thread/user/money]",
    cooldowns: 5
};

module.exports.run = async ({ event, api, args, Currencies, Users }) => {
    const { threadID, messageID } = event;
    const option = parseInt(args[1]) || 10;
    if (isNaN(option) || option <= 0) return api.sendMessage("❌ List length must be a number greater than 0", threadID, messageID);

    const expToLevel = (point) => {
        if (point < 0) return 0;
        return Math.floor((Math.sqrt(1 + (4 * point) / 3) + 1) / 2);
    }

    const BORDER = "══════════════════════════\n";

    // ===== Top Users by Level =====
    if (args[0] == "user") {
        const all = await Currencies.getAll(['userID', 'exp']);
        all.sort((a, b) => b.exp - a.exp);

        let msgBody = `🏆✨ 𝗣𝗿𝗲𝗺𝗶𝘂𝗺 𝗧𝗼𝗽 𝗨𝘀𝗲𝗿𝘀 𝗕𝘆 𝗟𝗲𝘃𝗲𝗹 ✨🏆\n${BORDER}`;
        for (let i = 0; i < Math.min(option, all.length); i++) {
            const user = all[i];
            const level = expToLevel(user.exp);
            const userData = await Users.getData(user.userID);
            msgBody += `🥇 ${i + 1}. ${userData.name}\n💎 Level: ${level}\n${BORDER}`;
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
            return api.sendMessage("❌ Error fetching thread list.", threadID, messageID);
        }

        for (const thread of data) {
            if (thread.isGroup) threadList.push({
                threadName: thread.name,
                threadID: thread.threadID,
                messageCount: thread.messageCount
            });
        }

        threadList.sort((a, b) => b.messageCount - a.messageCount);

        let msgBody = `🏆✨ 𝗧𝗼𝗽 ${Math.min(option, threadList.length)} 𝗚𝗿𝗼𝘂𝗽𝘀 𝗕𝘆 𝗠𝗲𝘀𝘀𝗮𝗴𝗲𝘀 ✨🏆\n${BORDER}`;
        for (let i = 0; i < Math.min(option, threadList.length); i++) {
            const t = threadList[i];
            msgBody += `🥈 ${i + 1}. ${t.threadName || "No Name"}\n🆔 TID: [${t.threadID}]\n✉️ Messages: ${t.messageCount}\n${BORDER}`;
        }
        return api.sendMessage(msgBody, threadID, messageID);
    }

    // ===== Top Users by Money =====
    if (args[0] == "money") {
        const all = await Currencies.getAll(['userID', 'money']);
        all.sort((a, b) => b.money - a.money);

        let msgBody = `💰✨ 𝗧𝗼𝗽 𝗥𝗶𝗰𝗵𝗲𝘀𝘁 𝗨𝘀𝗲𝗿𝘀 ✨💰\n${BORDER}`;
        for (let i = 0; i < Math.min(option, all.length); i++) {
            const user = all[i];
            const userData = await Users.getData(user.userID);
            msgBody += `🥉 ${i + 1}. ${userData.name}\n💵 Money: ${user.money.toLocaleString()}$\n${BORDER}`;
        }
        return api.sendMessage(msgBody, threadID, messageID);
    }

    // ===== Invalid argument =====
    return api.sendMessage("❌ Please use: +top [user/thread/money]", threadID, messageID);
};
                
