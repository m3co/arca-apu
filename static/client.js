'use strict';
((io) => {
  var client = io();
  function setupOptionCombobox(selection) {
    selection.attr('value', d => d.id)
      .attr('label', d => d.description)
      .each(function(d) {
        this._row = d;
      });
  }

  client.on('connect', () => {
    console.log('connection');

    client.emit('data', {
      query: 'select',
      module: 'preAPU',
      ContractorId: 2
    });

    client.emit('data', {
      query: 'subscribe',
      module: 'preAPU'
    });
  });

  client.on('response', (data) => {
    var query = data.query;
    var row = data.row;
    var action;
    if (row) {
      if (data.module == 'preAPU') {
        action = preapu[`do${query}`];
        if (action) { action(row); }
        else {
          console.log('sin procesar APU', data);
        }
      } else {
        console.log('sin procesar row', data);
      }
    } else {
      console.log('sin procesar', data);
    }
  });

  window.client = client;
})(io);
