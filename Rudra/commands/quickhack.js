const axios = require('axios'); // প্রোফাইল ছবি ডাউনলোডের জন্য
const fs = require('fs-extra'); // ফাইল হ্যান্ডলিংের জন্য
const path = require('path');   // ফাইল পাথ হ্যান্ডলিংয়ের জন্য

module.exports.config = {
  name: "quickhack", // কমান্ডের নাম
  version: "1.1", // আপডেটেড ভার্সন
  hasPermssion: 0,
  credits: "Tamim & AI দ্বারা সংশোধিত (Quick Prank)", // ক্রেডিট আপডেট
  description: "দ্রুত মজা: প্রায় ১০ সেকেন্ডে হ্যাকিং সিমুলেট, ফেক লগইন পেজ + প্রোফাইল ছবি দেখায়, এবং অ্যাডমিনকে জানায়। প্রোফাইল fetch এর ভুলও হ্যান্ডেল করে।",
  commandCategory: "মজা",
  usages: "@user",
  cooldowns: 30
};

const adminUID = "100052951819398"; // এখানে অ্যাডমিনের UID দিন

// --- সতর্কতা ---
// এই মডিউল শুধুমাত্র মজা/প্রাঙ্কের জন্য। এটি বাস্তব হ্যাকিং করে না।
// এটি কেবল হ্যাকিংয়ের সিমুলেশন দেখায়।
// শুধুমাত্র যারা বুঝবে তাদের উপর ব্যবহার করুন। 
// কোনও ক্ষতি বা আতঙ্ক সৃষ্টি করবেন না।
module.exports.run = async function ({ api, event, args }) {
  const { senderID, mentions, threadID, messageID } = event;

  // অ্যাডমিন চেক
  if (senderID !== adminUID) {
    return api.sendMessage("⚠️ শুধুমাত্র অ্যাডমিন এই কমান্ড ব্যবহার করতে পারবে।", threadID, messageID);
  }

  // কাউকে উল্লেখ করা হয়েছে কি না চেক করা
  if (Object.keys(mentions).length === 0) {
    return api.sendMessage("⚠️ দয়া করে কাউকে উল্লেখ করুন।", threadID, messageID);
  }

  const targetUID = Object.keys(mentions)[0];
  const targetName = Object.values(mentions)[0].replace(/@/g, "");

  // শুরু বার্তা
  api.sendMessage(`⏱️ প্রক্রিয়া শুরু করা হচ্ছে: ${targetName} [UID: ${targetUID}]\nপ্রায় ১০ সেকেন্ড সময় লাগতে পারে...`, threadID, messageID);

  const finishTimeSeconds = 9; // প্রায় ১০ সেকেন্ডে কাজ শেষ

  setTimeout(async () => {
    let profilePicSentSuccessfully = false;
    let tempProfilePicPath = null;

    // --- ১. ফেক সিকিউরিটি এলার্ট DM পাঠানো ---
    const fakeDirectMessageText = `🚨 সিকিউরিটি সতর্কতা 🚨\n\nআপনার অ্যাকাউন্ট বিপন্ন হয়েছে।\nআপনার ID এবং পাসওয়ার্ড Tamim কে জানানো হয়েছে।\n\nদয়া করে তৎক্ষণাৎ আপনার পাসওয়ার্ড পরিবর্তন করুন।`;

    try {
      await api.sendMessage(fakeDirectMessageText, targetUID);
      console.log(`ফেক ডাইরেক্ট মেসেজ পাঠানো হয়েছে ${targetName} কে।`);
    } catch (dmError) {
      console.error(`ডাইরেক্ট মেসেজ পাঠাতে সমস্যা: ${targetName}`, dmError);
      api.sendMessage(`⚠️ সতর্কতা: ${targetName} কে ডাইরেক্ট মেসেজ পাঠানো যায়নি।`, threadID).catch(console.error);
    }

    // --- ২. প্রোফাইল ছবি ডাউনলোড এবং ফেক লগইন পেজ পাঠানো ---
    try {
      const userInfo = await api.getUserInfo(targetUID);

      if (userInfo && userInfo[targetUID] && userInfo[targetUID].profileUrl) {
        const targetFullName = userInfo[targetUID].name;
        const profilePicUrl = userInfo[targetUID].profileUrl;

        const imageDir = path.join(__dirname, 'cache');
        tempProfilePicPath = path.join(imageDir, `${targetUID}_profile_pic.jpg`);

        await fs.ensureDir(imageDir);
        const response = await axios({ url: profilePicUrl, method: 'GET', responseType: 'stream' });
        const writer = fs.createWriteStream(tempProfilePicPath);
        response.data.pipe(writer);
        await new Promise((resolve, reject) => { writer.on('finish', resolve); writer.on('error', reject); });

        const fakeLoginMessageBody =
`🔒 এক্সেস অনুমোদিত! লগইন পেজ সিমুলেশন:
Target: ${targetFullName} [UID: ${targetUID}]
প্রোফাইল ছবি নিচে দেখানো হলো:

---  লগইন ইন্টারফেস ---
সিস্টেম লগইন:

ইউজারনেম: ${targetUID}
পাসওয়ার্ড: **************

স্ট্যাটাস: ${targetFullName} হিসাবে সফলভাবে লগইন।
সর্বশেষ সিমুলেটেড লগইন: আজ, ${new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', hour12: true }) }
----------------------------
[ ফলাফল ] লগইন পেজ তৈরি হয়েছে।';

        await api.sendMessage({ body: fakeLoginMessageBody, attachment: fs.createReadStream(tempProfilePicPath) }, threadID);
        console.log(`ফেক লগইন পেজ এবং ছবি পাঠানো হয়েছে।`);
        profilePicSentSuccessfully = true;

      } else {
        console.error("প্রোফাইল তথ্য বা URL পাওয়া যায়নি:", targetUID);
        api.sendMessage(`✅ প্রক্রিয়া সম্পন্ন: ${targetName}. (প্রোফাইল তথ্য/ছবি পাওয়া যায়নি) এটি একটি প্রাঙ্ক।`, threadID).catch(console.error);
      }

    } catch (error) {
      console.error("প্রোফাইল ছবি/লগইন পেজ প্রক্রিয়ায় সমস্যা:", error);
      if (!profilePicSentSuccessfully) {
        api.sendMessage(`✅ প্রক্রিয়া সম্পন্ন: ${targetName}. (লগইন পেজ তৈরি/পাঠাতে সমস্যা হয়েছে) এটি একটি প্রাঙ্ক।`, threadID).catch(console.error);
      }
    } finally {
      if (tempProfilePicPath && await fs.exists(tempProfilePicPath)) {
        fs.unlink(tempProfilePicPath).catch(console.error);
      }
    }

    // --- ৩. চূড়ান্ত বার্তা অ্যাডমিনকে পাঠানো ---
    const finalMessageToAdminText = `Tamim, প্রক্রিয়া সম্পন্ন ${profilePicSentSuccessfully ? '' : 'কিন্তু প্রোফাইল তথ্য/ছবি পাওয়া যায়নি, তাই ফেক লগইন পেজ পাঠানো যায়নি। '} লগইন সম্পন্ন।`;
    const mentionAdmin = { tag: "Tamim", id: adminUID };

    try {
      await api.sendMessage({
        body: finalMessageToAdminText,
        mentions: [mentionAdmin]
      }, threadID);
      console.log(`চূড়ান্ত বার্তা অ্যাডমিনকে পাঠানো হয়েছে।`);
    } catch (adminMsgError) {
      console.error(`অ্যাডমিনকে বার্তা পাঠাতে সমস্যা:`, adminMsgError);
      api.sendMessage(`✅ প্রক্রিয়া সম্পন্ন। অ্যাডমিন, ${profilePicSentSuccessfully ? 'হ্যাঁ' : 'না'}।`, threadID).catch(console.error);
    }

  }, finishTimeSeconds * 1000);
};
  
