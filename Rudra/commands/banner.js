module.exports.config = {
  name: "banner",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 | Fixed by Tamim",
  description: "Generates custom anime banner",
  commandCategory: "game",
  usages: "{number}|{name1}|{name2}|{name3}|{color}",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const { loadImage, createCanvas, registerFont } = require("canvas");
  const fs = require("fs-extra");
  const axios = require("axios");
  const path = require("path");

  try {
    // Argument split
    const parts = args.join(" ").trim().replace(/\s*\|\s*/g, "|").split("|");
    const text1 = parts[0] || "1"; // character number
    const text2 = parts[1] || ""; // main name
    const text3 = parts[2] || ""; // signature
    const text4 = parts[3] || ""; // tagline
    const color = parts[4] || "no";

    // Paths
    const dir = path.join(__dirname, "tad");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    const pathBg = path.join(dir, "background.png");
    const pathAva = path.join(dir, "avatar.png");
    const pathOut = path.join(dir, `banner_${Date.now()}.png`);

    // Character data
    const characters = (await axios.get("https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864")).data;
    const charData = characters[text1 - 1];
    if (!charData) return api.sendMessage("❌ Invalid number. Please try again.", event.threadID, event.messageID);

    // Download images
    const avtAnime = (await axios.get(charData.imgAnime, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathAva, Buffer.from(avtAnime, "binary"));

    const background = (await axios.get("https://i.imgur.com/Ch778s2.png", { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathBg, Buffer.from(background, "binary"));

    // Fonts
    const font1 = path.join(dir, "PastiOblique.otf");
    const font2 = path.join(dir, "gantellinesignature.ttf");
    const font3 = path.join(dir, "Bebas.ttf");

    if (!fs.existsSync(font1)) {
      const f1 = (await axios.get("https://github.com/hanakuUwU/font/raw/main/PastiOblique-7B0wK.otf", { responseType: "arraybuffer" })).data;
      fs.writeFileSync(font1, Buffer.from(f1, "binary"));
    }
    if (!fs.existsSync(font2)) {
      const f2 = (await axios.get("https://github.com/hanakuUwU/font/raw/main/gantellinesignature-bw11b.ttf", { responseType: "arraybuffer" })).data;
      fs.writeFileSync(font2, Buffer.from(f2, "binary"));
    }
    if (!fs.existsSync(font3)) {
      const f3 = (await axios.get("https://github.com/hanakuUwU/font/raw/main/UTM%20Bebas.ttf?raw=true", { responseType: "arraybuffer" })).data;
      fs.writeFileSync(font3, Buffer.from(f3, "binary"));
    }

    // Register fonts
    registerFont(font1, { family: "PastiOblique" });
    registerFont(font2, { family: "Gantelli" });
    registerFont(font3, { family: "Bebas" });

    // Canvas draw
    const a = await loadImage(pathBg);
    const ab = await loadImage(pathAva);
    const canvas = createCanvas(a.width, a.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(a, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(ab, 1500, -400, 1980, 1980);

    // Main name
    ctx.fillStyle = color.toLowerCase() === "no" ? charData.colorBg : color;
    ctx.font = "370px PastiOblique";
    ctx.fillText(text2, 500, 750);

    // Signature
    ctx.fillStyle = "#fff";
    ctx.font = "350px Gantelli";
    ctx.fillText(text3, 500, 680);

    // Tagline
    ctx.textAlign = "end";
    ctx.fillStyle = "#f56236";
    ctx.font = "145px PastiOblique";
    ctx.fillText(text4, 2100, 870);

    // Save output
    fs.writeFileSync(pathOut, canvas.toBuffer());

    // Send result
    return api.sendMessage(
      {
        body: "✅ Here's your banner:",
        attachment: fs.createReadStream(pathOut)
      },
      event.threadID,
      () => {
        fs.unlinkSync(pathOut);
        fs.unlinkSync(pathAva);
        fs.unlinkSync(pathBg);
      },
      event.messageID
    );
  } catch (e) {
    return api.sendMessage("❌ Error: " + e.message, event.threadID, event.messageID);
  }
};
	
