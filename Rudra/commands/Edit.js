const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

// Register custom font (optional)
registerFont(path.join(__dirname, "fonts", "Roboto-Bold.ttf"), { family: "Roboto" });

module.exports.config = {
    name: "edit",
    version: "2.0",
    credits: "Md Tamim x ChatGPT",
    description: "Advanced interactive photo editor: overlays, text, memes, emoji",
    commandCategory: "image",
    usages: "+edit <prompt>"
};

// Predefined overlays
const OVERLAYS = {
    "add a girl": "images/girl.png",
    "hug boy": "images/hug.png",
    "funny hat": "images/hat.png",
    "glasses": "images/glasses.png",
    "heart": "images/heart.png",
    "emoji smile": "images/emoji_smile.png"
};

module.exports.run = async function({ api, event, args }) {
    if (!args[0]) return api.sendMessage("❌ Usage: +edit <prompt>", event.threadID);

    const prompt = args.join(" ").toLowerCase();
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    // Check replied image
    const reply = event.messageReply;
    if (!reply || !reply.attachments || reply.attachments.length === 0) {
        return api.sendMessage("❌ Please reply to an image first!", event.threadID);
    }

    const imageUrl = reply.attachments[0].url;

    let baseImage;
    try { baseImage = await loadImage(imageUrl); } 
    catch { return api.sendMessage("❌ Failed to load image.", event.threadID); }

    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, baseImage.width, baseImage.height);

    // Apply overlays dynamically
    for (const key in OVERLAYS) {
        if (prompt.includes(key)) {
            const overlayPath = path.join(__dirname, OVERLAYS[key]);
            if (fs.existsSync(overlayPath)) {
                const overlay = await loadImage(overlayPath);
                // Auto resize proportional to base image
                const scale = baseImage.width / 4 / overlay.width;
                const w = overlay.width * scale;
                const h = overlay.height * scale;

                // Smart position: bottom-right by default
                let x = baseImage.width - w - 20;
                let y = baseImage.height - h - 20;

                if (key.includes("hug")) { x = 50; y = baseImage.height - h - 50; }
                if (key.includes("emoji")) { x = baseImage.width/2 - w/2; y = 50; }

                ctx.drawImage(overlay, x, y, w, h);
            }
        }
    }

    // Add text overlay if prompt is generic
    if (!Object.keys(OVERLAYS).some(k => prompt.includes(k))) {
        ctx.font = "bold 80px Roboto";
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 6;
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(0,0,0,0.7)";
        ctx.shadowBlur = 10;
        ctx.strokeText(args.join(" "), baseImage.width / 2, baseImage.height - 100);
        ctx.fillText(args.join(" "), baseImage.width / 2, baseImage.height - 100);
    }

    // Save final image
    const outPath = path.join(cacheDir, `edit_${Date.now()}.png`);
    fs.writeFileSync(outPath, canvas.toBuffer("image/png"));

    // Send edited image
    api.sendMessage({ body: "🖼 Here is your advanced edited image:", attachment: fs.createReadStream(outPath) }, event.threadID);
};
