const Social = require(`${process.cwd()}/base/Social.js`);
const wthr = require("weather-js");

class Weather extends Social {
  constructor(client) {
    super(client, {
      name: "weather",
      description: "Tells the current weather in a given area.",
      usage: "weather [-f for Fahrenheit] [-c for Celsius] <location>",
      aliases: ["temp"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    var temp = "";
    if (args[0] == null) return message.reply("I need a location...");
    if (message.flags == []) { temp = "F"; } else {temp = message.flags[0];}
    await wthr.find({search: args[0], degreeType: temp}, function(err, result) {
      if (err) console.log(err);
      const current = result[0].current;
      const location = result[0].location;
      replace(current, location, message, this.client);
    });
  }
}

async function replace(current, location, message, client) {
  const resp = await client.responses.weatherMessages.random().replaceAll("{{observationpoint}}", current.observationpoint).replaceAll("{{degreetype}}", location.degreetype).replaceAll("{{windspeed}}", current.windspeed).replaceAll("{{winddisplay}}", current.winddisplay).replaceAll("{{skytext}}", current.skytext).replaceAll("{{humidity}}", current.humidity).replaceAll("{{temperature}}", current.temperature);
  message.reply(resp);
}

module.exports = Weather;

