module.exports.config = {
  name: "pending",
  version: "1.0.6",
  credits: "TAMIM",
  hasPermssion: 2,
  description: "Manage bot's waiting messages",
  commandCategory: "system",
  cooldowns: 5
};

module.exports.languages = {
  "vi": {
    "invaildNumber": "%1 không phải là một con số hợp lệ",
    "cancelSuccess": "Đã từ chối thành công %1 nhóm!",
    "notiBox": "Box của bạn đã được admin phê duyệt để có thể sử dụng bot",
    "approveSuccess": "Đã phê duyệt thành công %1 nhóm!",
    "cantGetPendingList": "Không thể lấy danh sách các nhóm đang chờ!",
    "returnListPending": "「PENDING」❮ Tổng số nhóm cần duyệt: %1 nhóm ❯\n\n%2",
    "returnListClean": "「PENDING」Hiện tại không có nhóm nào trong hàng chờ"
  },
  "en": {
    "invaildNumber": "%1 is not a valid number",
    "cancelSuccess": "Refused %1 thread!",
    "notiBox": "🌸━━━━━━━━━━━━🌸\n   ✅ 𝗧𝗔𝗠𝗜𝗠 𝗕𝗼𝗧 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 ✅\n🌸━━━━━━━━━━━━🌸\n✨ Group Connected Successfully!\n📌 Type +help To See All Features 🚀\n💖 Enjoy Using TAMIM BoT 💖\n\n🤖 আমি একটি রোবট! আমাকে দিয়ে আপনি চ্যাট, মজা আর হেল্পফুল কমান্ড চালাতে পারবেন 🚀",
    "approveSuccess": "Approved successfully %1 threads!",
    "cantGetPendingList": "Can't get the pending list!",
    "returnListPending": "»「PENDING」«❮ The whole number of threads to approve is: %1 thread ❯\n\n%2",
    "returnListClean": "「PENDING」There is no thread in the pending list"
  }
}

module.exports.handleReply = async function({ api, event, handleReply, getText }) {
  if (String(event.senderID) !== String(handleReply.author)) return;
  const { body, threadID, messageID } = event;
  var count = 0;

  if (body.startsWith("c") || body.startsWith("cancel")) {
    const index = (body.slice(body.indexOf("c") == 0 ? 1 : 6)).split(/\s+/);
    for (const singleIndex of index) {
      if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > handleReply.pending.length) 
        return api.sendMessage(getText("invaildNumber", singleIndex), threadID, messageID);
      api.removeUserFromGroup(api.getCurrentUserID(), handleReply.pending[singleIndex - 1].threadID);
      count += 1;
    }
    return api.sendMessage(getText("cancelSuccess", count), threadID, messageID);
  } else {
    const index = body.split(/\s+/);
    for (const singleIndex of index) {
      if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > handleReply.pending.length) 
        return api.sendMessage(getText("invaildNumber", singleIndex), threadID, messageID);
      api.sendMessage(getText("notiBox"), handleReply.pending[singleIndex - 1].threadID);
      count += 1;
    }
    return api.sendMessage(getText("approveSuccess", count), threadID, messageID);
  }
}

module.exports.run = async function({ api, event, getText }) {
  const { threadID, messageID } = event;
  const commandName = this.config.name;
  var msg = "", index = 1;

  try {
    var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
    var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
  } catch (e) { 
    return api.sendMessage(getText("cantGetPendingList"), threadID, messageID) 
  }

  const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);

  for (const single of list) msg += `${index++}/ ${single.name} (${single.threadID})\n`;

  if (list.length != 0) return api.sendMessage(getText("returnListPending", list.length, msg), threadID, (error, info) => {
    global.client.handleReply.push({
      name: commandName,
      messageID: info.messageID,
      author: event.senderID,
      pending: list
    })
  }, messageID);
  else return api.sendMessage(getText("returnListClean"), threadID, messageID);
}
