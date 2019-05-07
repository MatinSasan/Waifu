const Discord = require('discord.js');
const { prefix, token, giphyToken } = require('./config.json');
const client = new Discord.Client();

const GphApiClient = require('giphy-js-sdk-core');
const giphy = GphApiClient(giphyToken);

client.once('ready', () => {
  console.log('ready');
});

client.on('message', message => {
  // console.log(message.content);
  if (message.content.startsWith(`${prefix}love`)) {
    giphy
      .search('gifs', { q: 'love' })
      .then(res => {
        let totalResponses = res.data.length;
        let responseIndex = Math.floor(Math.random() * 10 + 1) % totalResponses;
        let responseFinal = res.data[responseIndex];

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
