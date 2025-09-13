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
  version: "6.0.0",
  hasPermssion: 0,
  credits: "Priyansh Rajput + Modified by Tamim",
  description: "Spinning style Game Machine slot",
  commandCategory: "game-sp",
  usages: "[bet amount]",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args, Currencies }) {
  const { threadID, messageID, senderID } = event;
  const { getData, increaseMoney, decreaseMoney } = Currencies;

  const slotItems = ["🍇", "🍉", "🍊", "🍏", "7️⃣", "🍓", "🍒", "🍌", "🥝", "🥑", "🌽"];
  const moneyUser = (await getData(senderID)).money;

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

  // Initial spinning animation
  let spinMsg = await api.sendMessage(`🎰 SLOT MACHINE 🎰\n━━━━━━━━━━━━━━━\n❓ | ❓ | ❓\n━━━━━━━━━━━━━━━\nSpinning... 🎡`, threadID, messageID);

  for (let i = 0; i < 10; i++) {
    let tempSlot = [];
    for (let j = 0; j < 3; j++) tempSlot[j] = slotItems[Math.floor(Math.random() * slotItems.length)];
    await new Promise(resolve => setTimeout(resolve, 500)); // 0.5s delay
    await api.unsendMessage(spinMsg.messageID); // delete previous
    spinMsg = await api.sendMessage(`🎰 SLOT MACHINE 🎰\n━━━━━━━━━━━━━━━\n${tempSlot[0]} | ${tempSlot[1]} | ${tempSlot[2]}\n━━━━━━━━━━━━━━━\nSpinning... 🎡`, threadID);
  }

  // Show final result
  let resultText = `🎰 SLOT MACHINE 🎰\n━━━━━━━━━━━━━━━\n${slotItems[finalSlot[0]]} | ${slotItems[finalSlot[1]]} | ${slotItems[finalSlot[2]]}\n━━━━━━━━━━━━━━━`;

  if (win) {
    resultText += `\n✅ You WIN!\n💰 Prize: ${formatMoney(reward)}$`;
    await increaseMoney(senderID, reward);
  } else {
    resultText += `\n❌ You LOSE!\n💸 Lost: ${formatMoney(reward)}$`;
    await decreaseMoney(senderID, reward);
  }

  await api.unsendMessage(spinMsg.messageID);
  api.sendMessage(resultText, threadID);
};
	
