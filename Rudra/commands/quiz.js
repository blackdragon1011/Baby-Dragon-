const fs = require("fs");
const path = require("path");

const quizFile = path.join(__dirname, "cache", "quiz.json");

// প্রতিদিন সর্বোচ্চ 20টা কুইজ খেলার সীমা
const dailyLimit = 20;

// ইউজারদের খেলার হিসাব রাখার জন্য মেমোরি অবজেক্ট
let userPlayCount = {};

module.exports.config = {
  name: "quiz",
  version: "1.0.0",
  author: "Tamim", //don't change credit 
  countDown: 5,
  role: 0,
  shortDescription: "Quiz Game",
  longDescription: "পদার্থবিজ্ঞান আর রসায়নের কুইজ ধাঁধা। সঠিক উত্তর দিলে 3000 টাকা জিতবে, ভুল হলে 3000 টাকা কেটে যাবে।",
  category: "game",
  guide: {
    en: "{p}{n} -> কুইজ শুরু করো"
  }
};

module.exports.onStart = async function ({ api, event, Users, Currencies }) {
  try {
    // প্রতিদিনের limit reset (midnight এ reset)
    const today = new Date().toDateString();
    if (!userPlayCount[event.senderID] || userPlayCount[event.senderID].date !== today) {
      userPlayCount[event.senderID] = { count: 0, date: today };
    }

    if (userPlayCount[event.senderID].count >= dailyLimit) {
      return api.sendMessage("❌ আজকের জন্য তোমার 20 টার limit শেষ হয়ে গেছে! কালকে আবার চেষ্টা করো।", event.threadID, event.messageID);
    }

    // quiz.json লোড করা
    if (!fs.existsSync(quizFile)) {
      return api.sendMessage("⚠️ quiz.json ফাইল cache ফোল্ডারে পাওয়া যায়নি!", event.threadID, event.messageID);
    }

    const quizzes = JSON.parse(fs.readFileSync(quizFile));
    if (quizzes.length === 0) {
      return api.sendMessage("⚠️ quiz.json ফাঁকা আছে, আগে প্রশ্ন যোগ করো!", event.threadID, event.messageID);
    }

    // র‌্যান্ডম কুইজ নাও
    const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];

    api.sendMessage(
      `🤔 কুইজ:\n\n${randomQuiz.question}\n\n1️⃣ ${randomQuiz.options[0]}\n2️⃣ ${randomQuiz.options[1]}\n3️⃣ ${randomQuiz.options[2]}\n4️⃣ ${randomQuiz.options[3]}\n\n👉 সঠিক উত্তর দিতে 1-4 এর মধ্যে একটি সংখ্যা রিপ্লাই করো।`,
      event.threadID,
      (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "quiz",
          author: event.senderID,
          correctAnswer: randomQuiz.answer,
          messageID: info.messageID
        });
      },
      event.messageID
    );
  } catch (e) {
    console.error(e);
    api.sendMessage("❌ কুইজ চালু করতে সমস্যা হচ্ছে।", event.threadID, event.messageID);
  }
};

module.exports.onReply = async function ({ api, event, reply, Currencies }) {
  const { author, correctAnswer, messageID } = reply;

  if (event.senderID !== author) return;

  const userAnswer = parseInt(event.body.trim());

  if (isNaN(userAnswer) || userAnswer < 1 || userAnswer > 4) {
    return api.sendMessage("⚠️ উত্তর দিতে হলে 1-4 এর মধ্যে একটি সংখ্যা লিখতে হবে।", event.threadID, event.messageID);
  }

  // ইউজারের play count update
  const today = new Date().toDateString();
  if (!userPlayCount[event.senderID] || userPlayCount[event.senderID].date !== today) {
    userPlayCount[event.senderID] = { count: 0, date: today };
  }
  userPlayCount[event.senderID].count++;

  // উত্তরের ফলাফল চেক
  if (userAnswer === correctAnswer) {
    await Currencies.increaseMoney(event.senderID, 3000);
    api.sendMessage("🎉 সঠিক উত্তর! তুমি জিতেছো 3000 টাকা।", event.threadID, event.messageID);
  } else {
    await Currencies.decreaseMoney(event.senderID, 3000);
    api.sendMessage(`❌ ভুল উত্তর! তোমার 3000 টাকা কেটে নেওয়া হলো। সঠিক উত্তর ছিল: ${correctAnswer}`, event.threadID, event.messageID);
  }

  // cleanup
  global.GoatBot.onReply.delete(messageID);
};
      
