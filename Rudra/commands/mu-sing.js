const axios = require("axios");
const fs = require("fs");
const yts = require("yt-search");
const path = require("path");

const cacheDir = path.join(__dirname, "/cache");

module.exports = {
  config: {
    name: "sing",
    version: "3.0",
    author: "Priyanshu Rajput",
    description: { en: "Search and download audio from YouTube using Priyanshu API" },
    category: "media",
    guide: { en: "{pn} <search term> — search YouTube and download song (M4A format)" }
  },

  onStart: async ({ api, args, event }) => {
    if (!args.length)
      return api.sendMessage(
        "❌ Usage: {prefix} sing <search term>",
        event.threadID,
        event.messageID
      );

    const query = args.join(" ");
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      // Step 1: Search video on YouTube
      const search = await yts(query);
      const video = search.videos[0];
      if (!video) {
        api.setMessageReaction("⭕", event.messageID, () => {}, true);
        return api.sendMessage(
          `⭕ No results found for: ${query}`,
          event.threadID,
          event.messageID
        );
      }

      const videoUrl = video.url;

      // Step 2: Call your POST API
      const apiUrl = "https://priyanshuapi.xyz/api/runner/youtube-downloader/download";
      const headers = {
        Authorization: "Bearer apim_FGQiSaxP3fwJ-zAUSwLNaNl522Ri83elWNCNWeUVZzE",
        "Content-Type": "application/json",
      };

      const response = await axios.post(apiUrl, { url: videoUrl }, { headers });

      if (!response.data || !response.data.data || !response.data.data.items) {
        throw new Error("Invalid API response structure.");
      }

      const items = response.data.data.items;

      // Step 3: Find M4A/AAC format
      const audioItem = items.find((f) => {
        const q = (f.quality || "").toLowerCase();
        const label = (f.label || "").toLowerCase();
        return q.includes("m4a") || q.includes("aac") || label.includes("aac");
      });

      if (!audioItem || !audioItem.url) {
        const available = items.map((f) => f.quality || "unknown").join(", ");
        throw new Error(`No M4A format found. Available: ${available}`);
      }

      const downloadUrl = audioItem.url;

      // Step 4: Download the file
      const safeTitle = video.title.replace(/[^a-zA-Z0-9 \-_]/g, "");
      const audioPath = path.join(cacheDir, `${safeTitle}_${video.videoId}.m4a`);

      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const fileRes = await axios({
        url: downloadUrl,
        method: "GET",
        responseType: "stream",
      });

      const writer = fs.createWriteStream(audioPath);
      fileRes.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      // Step 5: Send audio file
      api.setMessageReaction("✅", event.messageID, () => {}, true);
      await api.sendMessage(
        {
          body: `🎶 Song Downloaded Successfully\n\n🎵 Title: ${video.title}\n📺 Channel: ${video.author.name}\n⏱ Duration: ${video.timestamp}`,
          attachment: fs.createReadStream(audioPath),
        },
        event.threadID,
        () => fs.unlinkSync(audioPath),
        event.messageID
      );
    } catch (err) {
      console.error("Error in sing command:", err.message || err);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      api.sendMessage(
        `❌ Failed to download song: ${err.message || "Unknown error"}`,
        event.threadID,
        event.messageID
      );
    }
  },
};
