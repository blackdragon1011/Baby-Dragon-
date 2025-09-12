const OWNER_UID = "100091383161288";
let lockedGroupNames = {};

module.exports.config = {
  name: "lockname",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Rudra x ChatGPT",
  description: "Lock group name. If changed, bot resets it. Owner-only.",
  commandCategory: "group",
  usages: "lockname lock/unlock/reset",
  cooldowns: 3
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, senderID } = event;
  if (senderID !== OWNER_UID) return api.sendMessage("only Tamim can use 😶🙌!", threadID);

  const subcmd = args[0]?.toLowerCase();
  if (!subcmd) return api.sendMessage("⚠️ Usage: lockname lock/unlock/reset <name>", threadID);

  switch (subcmd) {
    case "lock": {
      const name = args.slice(1).join(" ");
      if (!name) return api.sendMessage("give me a name!\nUsage: lockname lock Saim", threadID);
      lockedGroupNames[threadID] = name;
      await api.setTitle(name, threadID);
      return api.sendMessage(`🔒 Group name locked: ${name}`, threadID);
    }

    case "unlock": {
      delete lockedGroupNames[threadID];
      return api.sendMessage("🔓 Group name unlocked.", threadID);
    }

    case "reset": {
      if (!lockedGroupNames[threadID]) return api.sendMessage("⚠️ no name locked .", threadID);
      await api.setTitle(lockedGroupNames[threadID], threadID);
      return api.sendMessage(`♻️ Group name  reset again: ${lockedGroupNames[threadID]}`, threadID);
    }

    default:
      return api.sendMessage("⚠️ Usage: lockname lock/unlock/reset <name>", threadID);
  }
};

module.exports.lockedNames = lockedGroupNames;
