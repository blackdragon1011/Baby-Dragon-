const formatBet = (input) => {
  input = input.toLowerCase();
  if (input.endsWith("k")) return parseInt(input) * 1000;
  if (input.endsWith("m")) return parseInt(input) * 1000000;
  if (input.endsWith("b")) return parseInt(input) * 1000000000;
  if (input.endsWith("t")) return parseInt(input) * 1000000000000;
  return parseInt(input);
};

const formatMoney = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

module.exports.config = {
  name: "slot",
  version: "6.3.0",
  hasPermssion: 0,
  credits: "Priyansh Rajput + Modified by Tamim",
  description: "Slot machine with fancy output and recent balance",
  commandCategory: "game-sp",
  usages: "[bet amount]",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args, Currencies }) {
  const { threadID, messageID, senderID } = event;
  const { getData, increaseMoney, decreaseMoney } = Currencies;

  const slotItems = ["🍇", "🍉", "🍊", "🍏", "7️⃣", "🍓", "🍒", "🍌", "🥝", "🥑", "🌽"];
  const userData = await getData(senderID);
  const moneyUser = userData.money;

  var moneyBet = formatBet(args[0]);
  if (!moneyBet || isNaN(moneyBet) || moneyBet <= 0)
    return api.sendMessage("❌ Please enter a valid bet amount!", threadID, messageID);

  if (moneyBet > moneyUser)
    return api.sendMessage("💸 You don’t have enough balance!", threadID, messageID);

  if (moneyBet < 50)
    return api.sendMessage("⚠️ Minimum bet is 50$", threadID, messageID);

  // Final slot result
  let finalSlot = [];
  for (let i = 0; i < 3; i++) finalSlot[i] = Math.floor(Math.random() * slotItems.length);

  let reward = 0, win = false;
  const randomChance = Math.random() < 0.5;

  if (finalSlot[0] == finalSlot[1] && finalSlot[1] == finalSlot[2]) {
    reward = moneyBet * 9;
    win = true;
  } 
  else if (finalSlot[0] == finalSlot[1] || finalSlot[0] == finalSlot[2] || finalSlot[1] == finalSlot[2]) {
    reward = moneyBet * 2;
    win = true;
  } 
  else if (randomChance) {
    reward = Math.floor(moneyBet * 1.5);
    win = true;
  } 
  else {
    reward = moneyBet;
  }

  // Short spinning preview
  const spinPreview = [];
  for (let i = 0; i < 3; i++) spinPreview[i] = slotItems[Math.floor(Math.random() * slotItems.length)];
  const spinMsg = await api.sendMessage(`🎰 SLOT MACHINE 🎰\n━━━━━━━━━━━━━━━\n${spinPreview[0]} | ${spinPreview[1]} | ${spinPreview[2]}\n━━━━━━━━━━━━━━━\nSpinning... 🎡`, threadID);

  await new Promise(resolve => setTimeout(resolve, 1500));
  await api.unsendMessage(spinMsg.messageID);

  // Update balance
  if (win) await increaseMoney(senderID, reward);
  else await decreaseMoney(senderID, reward);

  const newBalance = (await getData(senderID)).money;

  // Fancy output
  let resultText = `🎰 𝗦𝗟𝗢𝗧 𝗠𝗔𝗖𝗛𝗜𝗡𝗘 🎰\n━━━━━━━━━━━━━━━\n${slotItems[finalSlot[0]]} | ${slotItems[finalSlot[1]]} | ${slotItems[finalSlot[2]]}\n━━━━━━━━━━━━━━━\n`;

  if (win) {
    resultText += `✅ 𝗬𝗢𝗨 𝗪𝗜𝗡!\n💰 Prize: ${formatMoney(reward)}$\n💵 Previous Balance: ${formatMoney(moneyUser)}$\n💎 Current Balance: ${formatMoney(newBalance)}$`;
  } else {
    resultText += `❌ 𝗬𝗢𝗨 𝗟𝗢𝗦𝗘!\n💸 Lost: ${formatMoney(reward)}$\n💵 Previous Balance: ${formatMoney(moneyUser)}$\n💎 Current Balance: ${formatMoney(newBalance)}$`;
  }

  api.sendMessage(resultText, threadID);
};
	  
