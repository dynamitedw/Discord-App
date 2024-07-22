const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const Discord  = require('discord.js');
const secret = require('./config.json');
const token = secret.token;
const { Client, GatewayIntentBits } = require('discord.js');
const Bot = new Client({ intents: [GatewayIntentBits.Guilds] | [GatewayIntentBits.GuildMembers] | [GatewayIntentBits.MessageContent] | [GatewayIntentBits.GuildMessages] });
Bot.commands = new Discord.Collection();
Bot.once('ready', async () => {

Bot.user.setUsername("FD Manager")
Bot.user.setActivity("ARK Survival Ascended");
console.log(Bot.user.username + ' Ready!');

const guilds = Bot.guilds.cache;
    console.log(`Bot is in ${guilds.size} server(s):`);
  guilds.forEach(guild => {
      console.log(`- ${guild.name} (ID: ${guild.id})`);
    //   guild.emojis.cache.forEach(emoji => {
    //   console.log(`Name: ${emoji.name}, ID: ${emoji.id}`);  
    // }); 
  });

const clientId = secret.clientId;
const guildId = secret.guildId;

const commands = [];
const commandsPath = path.join(__dirname, './Commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
//  console.log(command)
    commands.push(command.data.toJSON());
    Bot.commands.set(command.data.name, command);
}


const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
});

const creatures = require('./data/autocompletecreatures.json');
const creatureNames = creatures.map(i => i.name);
const bps = require('./data/autocompletebps.json');
const bpNames = bps.map(i => i.name);

Bot.on("interactionCreate", async (interaction) => {
  if (interaction.isAutocomplete()) {
    if (interaction.commandName === "stats") {
      const focusedValue = interaction.options.getFocused();
      const choices= creatureNames;

      let filtered = choices.filter((choice) =>
      choice.toLowerCase().startsWith(focusedValue, 0)
      );

      await interaction.respond(
        [...filtered.slice(0, 24)].map((choice) => ({
          name: choice,
          value: choice,
        }))
      );
    }} else {
  if (!interaction.isCommand()) return;

    const command = Bot.commands.get(interaction.commandName);

    if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
}}

});

Bot.login(token);
