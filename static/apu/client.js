'use strict';
((io) => {
  var client = io();

  client.on('connect', () => {
    console.log('connection');

    var ContractorId = location.search.match(/\d+$/);
    client.emit('data', {
      query: 'select',
      module: 'viewAPUSupplies',
      ContractorId: ContractorId ? ContractorId.toString() : 1
    });

    client.emit('data', {
      query: 'subscribe',
      module: 'viewAPUSupplies'
    });

    client.emit('data', {
      query: 'select',
      module: 'Contractors'
    });

    client.emit('data', {
      query: 'subscribe',
      module: 'Supplies'
    });
  });

  client.on('response', (data) => {
    var query = data.query;
    if (query == 'search') {
      if (data.module == 'Supplies') {
        viewapusupplies.dosearch(data);
      }
    }
    if (data.row) {
      if (data.module == 'viewAPUSupplies') {
        if (query == 'select') {
          viewapusupplies.doselect(data.row);
        } else if (query == 'update') {
          viewapusupplies.doupdate(data.row);
        } else if (query == 'insert') {
          viewapusupplies.doinsert(data.row);
        } else if (query == 'delete') {
          viewapusupplies.dodelete(data.row);
        } else {
          console.log('sin procesar viewAPUSupplies', data);
        }
      } else if (data.module == 'Contractors') {
        window.contractors.doselect(data.row);
      } else {
        console.log('sin procesar', data.row);
      }
    }
  });

  window.client = client;
})(io);
