const fs = require("fs");
const path = require("path");

const LOCKS_PATH = path.join(__dirname, "../../../includes/database/nameLocks.json");
const OWNER_UID = "100091383161288"; // 🔒 Owner UID

module.exports.config = {
  name: "autosetname",
  version: "1.0",
  author: "Rudra",
  countDown: 0,
  role: 0,
  shortDescription: "Lock/unlock user's nickname",
  longDescription: "Lock or unlock nickname for a specific user in a thread",
  category: "utility",
  guide: {
    en: "{pn} lock @mention NewName\n{pn} unlock @mention"
  }
};

module.exports.run = async function ({ api, event, args }) {
  if (event.senderID !== OWNER_UID) return api.sendMessage("Only Bot owner Can use this command 😑🙌.", event.threadID);

  if (!args[0] || event.mentions == undefined || Object.keys(event.mentions).length === 0)
    return api.sendMessage("❌ Use: lock/unlock @mention Name", event.threadID);

  const action = args[0].toLowerCase();
  const mentionedID = Object.keys(event.mentions)[0];
  const nameArgs = args.slice(1).join(" ").replace(/@.+?\s/, '').trim();

  let locks = {};
  if (fs.existsSync(LOCKS_PATH)) {
    locks = JSON.parse(fs.readFileSync(LOCKS_PATH, "utf-8"));
  }

  const threadID = event.threadID;

  if (!locks[threadID]) locks[threadID] = {};

  if (action === "lock") {
    if (!nameArgs) return api.sendMessage("please entar a name💞!", threadID);

    locks[threadID][mentionedID] = nameArgs;
    fs.writeFileSync(LOCKS_PATH, JSON.stringify(locks, null, 2));
    api.changeNickname(nameArgs, threadID, mentionedID);
    return api.sendMessage(`🔒 The name Is Locked: ${nameArgs}`, threadID);
  }

  if (action === "unlock") {
    if (locks[threadID] && locks[threadID][mentionedID]) {
      delete locks[threadID][mentionedID];
      fs.writeFileSync(LOCKS_PATH, JSON.stringify(locks, null, 2));
      return api.sendMessage("🔓 The Name is unlocked  .", threadID);
    } else {
      return api.sendMessage("⚠️ No locked before.", threadID);
    }
  }

  return api.sendMessage("❌ wrong synetic Use lock/unlock @mention", threadID);
};
