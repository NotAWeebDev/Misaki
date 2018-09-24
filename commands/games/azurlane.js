const Social = require("../../structures/Social.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

const rarity = {
  common: "#dcdcdc",
  rare: "#b0e0e6",
  elite: "#dda0dd",
  "super rare": "#eee8aa",
  legendary: "#123123"
};

const armor = {
  light: "L",
  medium: "M",
  heavy: "H"
};

class AzurLane extends Social {
  constructor(...args) {
    super(...args, {
      name: "azurlane",
      description: "Get your ship manifests.",
      usage: "azurlane <ship name>",
      guildOnly: true,
      cooldown: 10,
      category: "Games",
      aliases: ["az", "shipgirl"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is down at the dockyard.",
      botPerms: ["EMBED_LINKS"]
    });
  }

    
  async run(message, [...name], level, loadingMessage) { // eslint-disable-line no-unused-vars
    const embed = new MessageEmbed();
    const list = await fetch(`${process.env.SHIPAPI}/ship/${name}`);
    const ship = await list;
    
    if (ship.status === 404) return loadingMessage.edit("​", embed.setImage("https://i.imgur.com/e7AxbWS.png").setDescription("Whines... I'm s-sorry Commander, I c-couldn't find the s-s-ship you were looking for."));

    const result = await ship.json();
    const images = result.images.map(image => `[${image.name}](${image.url} '${image.name}')`).join(", ");

    embed.setTitle(`${result.names.en}, ${result.class} class ${result.type}`)
      .setURL(result.page_url)
      .setColor(rarity[result.rarity.toLowerCase()])
      .setThumbnail(result.chibi === "N/A" ? result.icon : result.chibi)
      .addField("Base Stats", `<:health:488726624356007936>  ${result.base.health}  <:armor:488726622766235662>  ${armor[result.base.armor.toLowerCase()]}  <:reload:488726624766787595>  ${result.base.reload}\n<:firepower:488726624343162880>  ${result.base.firepower}  <:torpedo:488726625429618688>  ${result.base.torpedo}  <:dodge:488726623882051596>  ${result.base.speed}\n<:aa:488726622514708480>  ${result.base.anti_air}  <:air:488726623168757760>  ${result.base.air_power}  <:oilusage:488726623802097674>  ${result.base.oil_usage}\n<:asw:488726623017893888>  ${result.base.anti_sub}`, true)
      .addField("Reinforcement Value", `<:firepower:488726624343162880>  ${result.reinforcement_value.firepower}  <:torpedo:488726625429618688>  ${result.reinforcement_value.torpedo}  <:air:488726623168757760>  ${result.reinforcement_value.air_power}  <:reload:488726624766787595>  ${result.reinforcement_value.reload}`, true)
      .addField("Equipment", `${result.equipment[0].equippable}: **${result.equipment[0].efficiency}**\n${result.equipment[1].equippable}: **${result.equipment[1].efficiency}**\n${result.equipment[2].equippable}: **${result.equipment[2].efficiency}**`, true)
      .addField("Scrap Income", `<:coin:488726623546245120>  ${result.scrap_income.coin}  <:oil:488726625077297152> ${result.scrap_income.oil}  <:medal:488726624754335763>  ${result.scrap_income.medal}`, true)
      .addField("Additional Artwork", images, true)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    await loadingMessage.edit("I found the ship Commander!", embed);
  }
}

module.exports = AzurLane;
