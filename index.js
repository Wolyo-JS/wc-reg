const { Client, Collection, MessageEmbed } = require("discord.js");
const client = new Client({ fetchAllMembers: true });
const fs = require("fs");
const config = client.config = require("./config.json");
const moment = require("moment");
require("moment-duration-format");
require("moment-timezone");
moment.locale("tr");
const mongoose = require("mongoose");
mongoose.connect(config.mongooseConnectURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(x => console.log("MongoDB bağlantısı kuruldu!")).catch(err => console.error(err));
mongoose.connection.on('error', (err) => {
  console.log(`[Mongoose Error]: ${err}`);
});

Array.prototype.clear = function() {
  let newArray = [];
  for (let i of this) {
   if (!newArray.includes(i) && i !== "" && i !== " ") newArray.push(i);
  };
  return newArray;
};

Date.prototype.toTurkishFormat = function() {
  return moment.tz(this, "Europe/Istanbul").format('LLL');
};

const events = fs.readdirSync("./events");
for (let event of events) {
  if (!event.endsWith(".js")) continue;
  let prop = require(`./events/${event}`);
  if (!prop.config) continue;
  if (prop.config.name !== "ready") {
    client.on(prop.config.name, prop);
  } else {
    client.on(prop.config.name, () => prop(client));
  };
  console.log(`[EVENT]: ${event} yüklendi!`);
};

client.commands = new Collection();
client.aliases = new Collection();
const commands = fs.readdirSync("./commands");
for (let command of commands) {
  if (!command.endsWith(".js")) continue;
  let prop = require(`./commands/${command}`);
  client.commands.set(prop.config.name, prop);
  if (prop.config.aliases) {
    prop.config.aliases.clear().forEach(aliase => {
      client.aliases.set(aliase, prop.config.name);
    });
  };
  console.log(`[KOMUT]: ${prop.config.name} yüklendi!`);
};



////
client.on("guildMemberAdd", member => {
    
    if (member.user.bot) return; 
let date = moment(member.user.createdAt)
       const startedAt = Date.parse(date);
       var msecs = Math.abs(new Date() - startedAt);
         
       const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
       msecs -= years * 1000 * 60 * 60 * 24 * 365;
       const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
       msecs -= months * 1000 * 60 * 60 * 24 * 30;
       const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
       msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
       const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
       msecs -= days * 1000 * 60 * 60 * 24;
       const hours = Math.floor(msecs / (1000 * 60 * 60));
       msecs -= hours * 1000 * 60 * 60;
       const mins = Math.floor((msecs / (1000 * 60)));
       msecs -= mins * 1000 * 60;
       const secs = Math.floor(msecs / 1000);
       msecs -= secs * 1000;
         
       var string = "";
       if (years > 0) string += `${years} yıl ${months} ay`
       else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks+" hafta" : ""}`
       else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days+" gün" : ""}`
       else if (days > 0) string += `${days} gün ${hours > 0 ? hours+" saat" : ""}`
       else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins+" dakika" : ""}`
       else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs+" saniye" : ""}`
       else if (secs > 0) string += `${secs} saniye`
           string = string.trim();
   
       let guild = member.client.guilds.cache.get("886512429318688818")
       let log = guild.channels.cache.get("886515451604140072");
       let endAt = member.user.createdAt
       let gün = moment(new Date(endAt).toISOString()).format('DD')
       let ay = moment(new Date(endAt).toISOString()).format('MM').replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık")
       let yıl = moment(new Date(endAt).toISOString()).format('YYYY')
       let saat = moment(new Date(endAt).toISOString()).format('HH:mm')
       let kuruluş = `${gün} ${ay} ${yıl} ${saat}`;
       log.send(`
:tada: Sunucumuza hoşgeldin ${member} ! 
 Hesabın **${kuruluş} (${string})** önce oluşturulmuş.
   
Sunucu kurallarımız <#886512715370221568> kanalında belirtilmiştir. Sunucu içersindeki ceza işlemlerin kuralları okuduğunu varsayılarak gerçekleştirilecek.
   
Seninle birlikte ${member.guild.memberCount} kişiye ulaştık. Kayıt olmak için sol tarafda bulunan **Confirmed** odalarına geçebilirsin.`)
};





var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
client.on('warn', e => { console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted'))); });
client.on('error', e => { console.log(chalk.bgRed(e.replace(regToken, 'that was redacted'))); });

client.login(process.env.token).then(x => console.log(`${client.user.tag} olarak bota giriş yapıldı!`)).catch(err => console.error(`Bota giriş yapılamadı!\n[HATA]: ${err}`));
