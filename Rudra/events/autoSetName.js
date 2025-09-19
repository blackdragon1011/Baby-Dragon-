const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "autoSetName",
    version: "1.0",
    hasPermssion: 0, // সকল user command দিতে পারবে, কিন্তু name change শুধুমাত্র admin control
    adminOnly: true,
    description: "Auto set bot name based on config",
    defaultName: "TAMIM", // এখানে নিজের নাম রাখো
};

module.exports.run = async function({ api, event, Users }) {
    try {
        // কেবল admin command ছাড়া auto name change
        const threadInfo = await api.getThreadInfo(event.threadID);
        const botID = api.getCurrentUserID();

        // শুধু bot নিজেই নাম পরিবর্তন করবে
        const currentName = threadInfo.threadName; 
        const desiredName = module.exports.config.defaultName;

        if (currentName !== desiredName) {
            await api.setTitle(desiredName, event.threadID);
            console.log(`✅ Bot name changed to ${desiredName} in group ${event.threadID}`);
        }
    } catch (err) {
        console.error("❌ Error auto changing name:", err);
    }
};

// Optional: Prevent anyone but admin changing bot name manually
module.exports.handleCommand = async function({ event, api, args, isAdmin }) {
    if (!isAdmin) {
        return api.sendMessage("⚠️ আপনি bot নাম পরিবর্তন করতে পারবেন না!", event.threadID);
    }
    if (args[0]) {
        module.exports.config.defaultName = args.join(" ");
        api.sendMessage(`✅ Bot name updated to ${module.exports.config.defaultName}`, event.threadID);
    }
};
