const fs = require("fs-extra");
const path = require("path");

const OWNER_UID = "100091383161288"; // Your UID
const NICKNAME_LOCK_FILE = path.join(__dirname, "../data/locked_nicknames.json");

// Function to load data
function loadLockedNicknames() {
    try {
        if (fs.existsSync(NICKNAME_LOCK_FILE)) {
            return JSON.parse(fs.readFileSync(NICKNAME_LOCK_FILE, "utf8"));
        }
    } catch (error) {
        console.error("Error loading locked nicknames:", error);
    }
    return {};
}

// Function to save data
function saveLockedNicknames(data) {
    try {
        fs.ensureFileSync(NICKNAME_LOCK_FILE);
        fs.writeFileSync(NICKNAME_LOCK_FILE, JSON.stringify(data, null, 2), "utf8");
    } catch (error) {
        console.error("Error saving locked nicknames:", error);
    }
}

module.exports.config = {
    name: "locknick",
    version: "2.3.0",
    author: "Your Name",
    hasPermssion: 0,
    credits: "Rudra x ChatGPT",
    description: "Lock/unlock nicknames in group",
    commandCategory: "group",
    usages: "locknick [on/off]",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, senderID } = event;
    const subcmd = args[0] ? args[0].toLowerCase() : "";

    let lockedNicknames = loadLockedNicknames();

    // Owner UID check
    if (senderID !== OWNER_UID) {
        return api.sendMessage("⛔ Only the owner can use this command!", threadID);
    }

    switch (subcmd) {
        case "on": {
            if (lockedNicknames[threadID]) {
                return api.sendMessage("🔒 This group is already in nickname lock mode.", threadID);
            }

            try {
                const threadInfo = await api.getThreadInfo(threadID);
                if (!threadInfo || !threadInfo.userInfo) {
                    return api.sendMessage("Unable to retrieve group info. Make sure the bot is in the group and has proper permissions.", threadID);
                }

                const currentNicks = {};
                for (const user of threadInfo.userInfo) {
                    if (user.id !== api.getCurrentUserID()) {
                        currentNicks[user.id] = user.nickname || "";
                    }
                }

                lockedNicknames[threadID] = currentNicks;
                saveLockedNicknames(lockedNicknames);

                return api.sendMessage("🔒 All members' nicknames in this group have been successfully locked.", threadID);

            } catch (error) {
                console.error("locknick 'on' command error:", error);
                return api.sendMessage("An error occurred while locking nicknames. Please check the logs.", threadID);
            }
        }

        case "off": {
            if (!lockedNicknames[threadID]) {
                return api.sendMessage("⚠️ This group is already in nickname unlock mode!", threadID);
            }

            try {
                delete lockedNicknames[threadID];
                saveLockedNicknames(lockedNicknames);

                return api.sendMessage("✅ Nickname lock has been successfully removed. Members can now change their nicknames.", threadID);
            } catch (error) {
                console.error("locknick 'off' command error:", error);
                return api.sendMessage("An error occurred while unlocking nicknames. Please check the logs.", threadID);
            }
        }

        default:
            return api.sendMessage("❌ Invalid option! Please use: `{p}locknick on` or `{p}locknick off`", threadID);
    }
};
                    
