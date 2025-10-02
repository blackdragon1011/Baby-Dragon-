// ========== USER INFO ==========
if (args[0] === "user") {
    let id;

    if (!args[1]) {
        id = event.type === "message_reply" ? event.messageReply.senderID : event.senderID;
    } else if (Object.keys(event.mentions).length > 0) {
        id = Object.keys(event.mentions)[0];
    } else {
        id = args[1];
    }

    let data = await api.getUserInfo(id);
    let user = data[id];

    // Extra info via Graph API
    let moreInfo;
    try {
        let res = await axios.get(`https://graph.facebook.com/${id}?fields=id,name,gender,link,birthday,hometown,location,relationship_status,work,education,email,friends.limit(0).summary(true),posts.limit(0).summary(true),followers_count&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
        moreInfo = res.data;
    } catch (e) {
        moreInfo = {};
    }

    let gender = user.gender == 2 ? "𓆩𝐂𝐮𝐭𝐞 𝐁𝐨𝐲𓆪" : user.gender == 1 ? "𓆩𝐂𝐮𝐭𝐞 𝐆𝐢𝐫𝐥𓆪" : "Unknown";
    let friend = user.isFriend ? "✅ Yes" : "❌ No";

    let msg =
`╭───────────────⭓
│ 👤 Name: ${moreInfo.name || user.name || "Not Public"}
│ 🆔 UID: ${id}
│ 🎭 Username: ${user.vanity || "Not Public"}
│ 🚻 Gender: ${gender}
│ 🤝 Friend with Bot: ${friend}
│ 🎂 Birthday: ${moreInfo.birthday || "Not Public"}
│ 🏡 Hometown: ${moreInfo.hometown?.name || "Not Public"}
│ 📍 Current City: ${moreInfo.location?.name || "Not Public"}
│ 💌 Relationship: ${moreInfo.relationship_status || "Not Public"}
│ 💼 Work: ${moreInfo.work ? moreInfo.work.map(w => w.employer?.name).join(", ") : "Not Public"}
│ 🏫 Education: ${moreInfo.education ? moreInfo.education.map(e => e.school?.name).join(", ") : "Not Public"}
│ 📧 Email: ${moreInfo.email || "Not Public"}
│ 👥 Friends: ${moreInfo.friends?.summary?.total_count || "Not Public"}
│ 📝 Total Posts: ${moreInfo.posts?.summary?.total_count || "Not Public"}
│ 👣 Followers: ${moreInfo.followers_count || "Not Public"}
│ 🔗 Profile: ${moreInfo.link || user.profileUrl || "Not Public"}
╰───────────────⭓`;

    var callback = () => api.sendMessage(
        { body: msg, attachment: fs.createReadStream(__dirname + "/cache/user.png") },
        event.threadID,
        () => fs.unlinkSync(__dirname + "/cache/user.png"),
        event.messageID
    );
    return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
        .pipe(fs.createWriteStream(__dirname + "/cache/user.png"))
        .on("close", () => callback());
}
