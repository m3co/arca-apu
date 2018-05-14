'use strict';
((io) => {
  var client = io();

  client.on('connect', () => {
    console.log('connection');
  });

  client.on('response', (data) => {
    var query = data.query;
  });

  window.client = client;
})(io);
