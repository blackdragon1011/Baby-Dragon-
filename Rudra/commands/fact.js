module.exports.config = {
  name: "fact",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Priyansh Rajput (Modified by Tamim)",
  description: "Random Bangla Facts",
  commandCategory: "fun",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const axios = global.nodemodule["axios"];

  try {
    // Step 1: Get fact (English)
    const res = await axios.get(`https://api.popcat.xyz/fact`);
    let fact = res.data.fact;

    // Step 2: Translate to Bangla (LibreTranslate)
    const translate = await axios.post(`https://libretranslate.de/translate`, {
      q: fact,
      source: "en",
      target: "bn",
      format: "text"
    }, { headers: { "Content-Type": "application/json" }});

    let banglaFact = translate.data.translatedText;

    // Step 3: Send message
    return api.sendMessage(`❓ জানেন কি?\n${banglaFact}`, event.threadID, event.messageID);
    
  } catch (e) {
    console.log(e);
    return api.sendMessage("❌ ফ্যাক্ট আনতে সমস্যা হয়েছে!", event.threadID, event.messageID);
  }
};
		
