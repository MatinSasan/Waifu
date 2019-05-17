const Discord = require('discord.js');
const { prefix, token, giphyToken } = require('./config.json');
const client = new Discord.Client();

// music api
const ytdl = require('ytdl-core');

// gif api
const GphApiClient = require('giphy-js-sdk-core');
const giphy = GphApiClient(giphyToken);

client.on('warn', console.warn);
client.on('error', console.error);

client.on('ready', () => {
  console.log('Ready');
  client.user.setActivity('with my master 😉');
});

client.on('disconnect', () => console.log('Disconnected. Will reconnect...'));
client.on('reconnecting', () => console.log('reconnecting...'));

// Bot reacting to user message

client.on('message', async message => {
  if (message.author.bot) {
    return;
  }

  // Bot chatter
  const firstLetter = message.content.charAt(0);

  if (firstLetter.toUpperCase() !== firstLetter && message.content !== 'lol') {
    let UpfirstLetter = message.content.charAt(0).toUpperCase();
    let restOfLetters = message.content.slice(1);

    if (firstLetter === 'l' && message.content.match(/lonely/gi)) {
      return message.channel.send(
        `*${UpfirstLetter}${restOfLetters}. Don't worry I'm here for you :)`
      );
    }
    return message.channel.send(`*${UpfirstLetter}${restOfLetters}`);
  }

  // if (message.content.search('hello' || 'hi')) {
  //   return message.channel.send("I'm here for you :] ");
  // }
  if (message.content.match(/lonely/gi)) {
    return message.channel.send("I'm here for you :] ");
  }

  // unknown command; must be after chatter

  if (!message.content.startsWith(prefix) && message.content !== 'lol') {
    return message.channel.send("Unknown command 🙃... it's okay, baby :3");
  }

  const args = message.content.split(' ');

  // MUSIC: if the music be food of love, play on!
  if (message.content.startsWith(`${prefix}play`)) {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) {
      return message.channel.send(
        "U kidding me, dear? Nobody's there in the voice channel\n... yet :)"
      );
    }

    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) {
      return message.channel.send(
        "I'm out of reach, baby... seems like I don't have the proper permissions"
      );
    }
    if (!permissions.has('SPEAK')) {
      return message.channel.send(' .______. *I cannot speak!*');
    }

    // finally the main LOGIC!
    try {
      var connection = await voiceChannel.join();
    } catch (error) {
      console.error(`I couldn't join voice channel, here's why: ${error}`);
      return message.channel.send(
        `I couldn't join voice channel :[ \nHere's why: ${error}`
      );
    }

    const dispatcher = connection
      .playStream(ytdl(args[1]))
      .on('end', () => {
        console.log('Song ended :)');
        voiceChannel.leave();
      })
      .on('error', error => console.log(error));

    dispatcher.setVolumeLogarithmic(5 / 5);
  } else if (message.content.startsWith(`${prefix}stop`)) {
    if (!message.member.voiceChannel) {
      return message.channel.send("you're not in our channel! 😮");
    }
    message.channel.send('Roger! ^_^');
    message.member.voiceChannel.leave();
  }

  // End of music play

  // LOVE: gif + affection
  if (message.content.startsWith(`${prefix}love`)) {
    giphy
      .search('gifs', { q: 'love' })
      .then(res => {
        let totalResponses = res.data.length;
        let responseIndex = Math.floor(Math.random() * 10 + 1) % totalResponses;
        let responseFinal = res.data[responseIndex];

        message.react('💗');
        message.channel.send('I love you:blue_heart:', {
          files: [responseFinal.images.fixed_height.url]
        });
      })
      .catch(() => {
        message.channel.send('Error :[');
      });
  }
});

client.login(token);
