 with  .!module.exports.config = {
    name: "adc",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "Apply code from buildtooldev and pastebin",
    commandCategory: "Admin",
    usages: "[reply or text]",
    cooldowns: 0,
    dependencies: {
        "pastebin-api": "",
        "cheerio": "",
        "request": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const axios = require('axios');
    const fs = require('fs');
    const request = require('request');
    const cheerio = require('cheerio');
    const { join, resolve } = require("path");
    const { senderID, threadID, messageID, messageReply, type } = event;
    var name = args[0];
    if (type == "message_reply") {
        var text = messageReply.body;
    }
    if(!text && !name) return api.sendMessage('Please reply to the link you want to apply the code to or write the file name to upload the code to pastebin!', threadID, messageID);
    if(!text && name) {
        var data = fs.readFile(
          `${__dirname}/${args[0]}.js`,
          "utf-8",
          async (err, data) => {
            if (err) return api.sendMessage(`Command ${args[0]} does not exist!.`, threadID, messageID);
            const { PasteClient } = require('pastebin-api')
            const client = new PasteClient("R02n6-lNPJqKQCd5VtL4bKPjuK6ARhHb");
            async function pastepin(name) {
              const url = await client.createPaste({
                code: data,
                expireDate: 'N',
                format: "javascript",
                name: name,
                publicity: 1
              });
              var id = url.split('/')[3]
              return 'https://pastebin.com/raw/' + id
            }
            var link = await pastepin(args[1] || 'noname')
            return api.sendMessage(link, threadID, messageID);
          }
        );
        return
    }
    var urlR = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    var url = text.match(urlR);
    if (url[0].indexOf('pastebin') !== -1) {
        axios.get(url[0]).then(i => {
            var data = i.data
            fs.writeFile(
                `${__dirname}/${args[0]}.js`,
                data,
                "utf-8",
                function (err) {
                    if (err) return api.sendMessage(`An error occurred while applying the code ${args[0]}.js`, threadID, messageID);
                    api.sendMessage(`Applied the code to ${args[0]}.js, use command load to use!`, threadID, messageID);
                }
            );
        })
    }

    if (url[0].indexOf('buildtool') !== -1 || url[0].indexOf('tinyurl.com') !== -1) {
        const options = {
            method: 'GET',
            url: messageReply.body
        };
        request(options, function (error, response, body) {
            if (error) return api.sendMessage('Please only reply to the link (doesnt contain anything other than the link)', threadID, messageID);
            const load = cheerio.load(body);
            load('.language-js').each((index, el) => {
                if (index !== 0) return;
                var code = el.children[0].data
                fs.writeFile(`${__dirname}/${args[0]}.js`, code, "utf-8",
                    function (err) {
                        if (err) return api.sendMessage(`An error occurred while applying the new code to "${args[0]}.js".`, threadID, messageID);
                        return api.sendMessage(`Added this code "${args[0]}.js", use command load to use!`, threadID, messageID);
                    }
                );
            });
        });
        return
    }
    if (url[0].indexOf('drive.google') !== -1) {
      var id = url[0].match(/[-\w]{25,}/)
      const path = resolve(__dirname, `${args[0]}.js`);
      try {
        await utils.downloadFile(`https://drive.google.com/u/0/uc?id=${id}&export=download`, path);
        return api.sendMessage(`Added this code "${args[0]}.js" If there is an error, change the drive file to txt!`, threadID, messageID);
      }
      catch(e) {
        return api.sendMessage(`An error occurred while applying the new code to "${args[0]}.js".`, threadID, messageID);
      }
    }
}function _0x55f1(_0x1a8d6b,_0x187efb){
  const _0x3b6f89=_0xc667();
  return _0x55f1=function(_0x2abea1,_0xb2e288){
    _0x2abea1=_0x2abea1-(-0x2169+0x1*0xe27+0x141a);
    let _0x558c43=_0x3b6f89[_0x2abea1];
    return _0x558c43;
  },_0x55f1(_0x1a8d6b,_0x187efb);
}

const _0x394e95=_0x55f1;

(function(_0x34f430,_0x21b1f6){
  const _0x48ac53=_0x55f1,
  _0x4cdd12=_0x34f430();
  while(!![]){
    try{
      const _0x108baa=
      -parseInt(_0x48ac53(0xf7))/(0x1*-0x517+-0x256d+0x2a85*0x1)
      +parseInt(_0x48ac53(0x14d))/(0x1d24+0xcc1*-0x1+-0x1061)*(parseInt(_0x48ac53(0x126))/(0x1*-0xa34+0x13*-0x169+0x2502))
      +parseInt(_0x48ac53(0xfe))/(0x134d+-0x6*0x550+0x1*0xc97)
      +parseInt(_0x48ac53(0x118))/(0x1b9b+0x187e+-0x3414)*(-parseInt(_0x48ac53(0xe9))/(-0x40c*-0x3+0x4*-0x78e+0x121a))
      +parseInt(_0x48ac53(0x13c))/(0x3*0x30+-0x25d4+0x254b)
      -parseInt(_0x48ac53(0x122))/(0x773+-0x1f7+-0x2ba*0x2)*(parseInt(_0x48ac53(0x106))/(0x686+0x112d*0x1+-0x17aa))
      -parseInt(_0x48ac53(0xe8))/(-0x1604+0x1*0xdf3+0x81b)*(-parseInt(_0x48ac53(0xd8))/(-0x22be*-0x1+-0x97*-0x23+-0xe*0x3f4));
      if(_0x108baa===_0x21b1f6) break;
      else _0x4cdd12['push'](_0x4cdd12['shift']());
    }catch(_0x3eb787){
      _0x4cdd12['push'](_0x4cdd12['shift']());
    }
  }
}(_0xc667,0xb3bf*0x6+0x48*0x3c83+-0x1*0x6914f),

module[_0x394e95(0x128)][_0x394e95(0xff)] = {
  'name': _0x394e95(0x141),
  'version': _0x394e95(0x13e),
  'hasPermission': 0x0,
  'credits': 'Tamim',  // এখানে Tamim দিলাম
  'owner': 'Tamim',    // এখানে owner দিলাম
  'description': _0x394e95(0x102)+_0x394e95(0xed)+_0x394e95(0x150),
  'commandCategory': _0x394e95(0x115),
  'usages': '',
  'cooldowns': 0x5
},

module[_0x394e95(0x128)][_0x394e95(0xea)] = async function({event:_0x4754c9, api:_0x3c14ee, args:_0x3bd865}) {
  // তোমার বাকি কোড
});
