const fs = require("fs");
const path = require("path");

// === Helper: safe JSON read/write ===
function readJSON(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    const txt = fs.readFileSync(file, "utf8");
    return JSON.parse(txt || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

// === Helper: today string in Asia/Dhaka ===
function todayDhaka() {
  // yyyy-mm-dd
  const d = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(d); // "YYYY-MM-DD"
  return parts;
}

module.exports.config = {
  name: "quiz",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Tamim",
  description: "Physics Riddle Quiz (+/-3000 টাকা) with daily limit",
  commandCategory: "Game",
  usages: "quiz",
  cooldowns: 3
};

// ইন-মেমরি ট্র্যাকার: কোন মেসেজে কোন উত্তর
let pending = {};

module.exports.run = async function ({ api, event, Currencies }) {
  const quizFile = path.join(__dirname, "cache", "quiz.json");
  const usageFile = path.join(__dirname, "cache", "quiz_usage.json");

  // quiz.json check
  if (!fs.existsSync(quizFile))
    return api.sendMessage("❌ `cache/quiz.json` ফাইল পাওয়া যায়নি!", event.threadID);

  // === Daily limit check (per user, max 20/day) ===
  const uid = String(event.senderID);
  const today = todayDhaka();

  const usage = readJSON(usageFile, {}); // { userID: { date: "YYYY-MM-DD", count: N } }
  const u = usage[uid] || { date: today, count: 0 };

  if (u.date !== today) {
    // নতুন দিন => কাউন্ট রিসেট
    u.date = today;
    u.count = 0;
  }
  if (u.count >= 20) {
    return api.sendMessage(
      "⛔ আজকের লিমিট শেষ! প্রতিদিন সর্বোচ্চ ২০টা ধাঁধা খেলতে পারো। কালকে আবার চেষ্টা করো 🕘",
      event.threadID
    );
  }

  // Load questions
  const data = readJSON(quizFile, []);
  if (!Array.isArray(data) || data.length === 0)
    return api.sendMessage("❌ `quiz.json` খালি!", event.threadID);

  // Random pick
  const q = data[Math.floor(Math.random() * data.length)];
  if (!q || !q.question || !Array.isArray(q.options) || !q.answer) {
    return api.sendMessage("❌ `quiz.json`-এ কিছু ভুল ফরম্যাট আছে।", event.threadID);
  }

  // Prepare options text
  let opts = "";
  q.options.forEach((opt, i) => (opts += `${i + 1}. ${opt}\n`));

  // Increase usage count NOW (question আইসেই 1 গণনা)
  u.count += 1;
  usage[uid] = u;
  writeJSON(usageFile, usage);

  api.sendMessage(
    `🧠 পদার্থবিজ্ঞানের ধাঁধা (${u.count}/20 - আজ)\n\n` +
      `❓ ${q.question}\n\n${opts}\n` +
      `👉 উত্তর দিতে শুধু নম্বর লিখো (1-${q.options.length})\n` +
      `✅ সঠিক হলে +3000 | ❌ ভুল হলে -3000`,
    event.threadID,
    (err, info) => {
      if (err) return;
      pending[info.messageID] = { answer: Number(q.answer), userID: uid };
    }
  );
};

module.exports.handleReply = async function ({ api, event, Currencies }) {
  const replyTo = event.messageReply?.messageID;
  if (!replyTo) return;
  const entry = pending[replyTo];
  if (!entry) return;

  if (String(event.senderID) !== String(entry.userID)) {
    return api.sendMessage("❌ এই ধাঁধাটা তুমি শুরু করোনি!", event.threadID);
  }

  const pick = parseInt(event.body.trim(), 10);
  if (isNaN(pick)) {
    return api.sendMessage("👉 শুধু নম্বর লিখো প্লিজ (1-4)।", event.threadID);
  }

  if (pick === entry.answer) {
    await Currencies.increaseMoney(event.senderID, 3000);
    api.sendMessage("✅ সঠিক! 🎉 তোমার একাউন্টে +3000 টাকা যোগ হলো।", event.threadID);
  } else {
    await Currencies.decreaseMoney(event.senderID, 3000);
    api.sendMessage("❌ ভুল! তোমার একাউন্ট থেকে -3000 টাকা কাটা হলো।", event.threadID);
  }

  delete pending[replyTo];
};
      
