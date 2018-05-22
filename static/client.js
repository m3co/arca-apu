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
      query: 'subscribe',
      module: 'Contractors'
    });

    client.emit('data', {
      query: 'subscribe',
      module: 'viewAPUSupplies'
    });

    client.emit('data', {
      query: 'subscribe',
      module: 'APU'
    });

    client.emit('data', {
      query: 'subscribe',
      module: 'Supplies'
    });

    client.emit('data', {
      query: 'select',
      module: 'Contractors'
    });

    client.emit('data', {
      query: 'select',
      module: 'viewpreAPU',
      parent: '2'
    });

    client.emit('data', {
      query: 'subscribe',
      module: 'viewpreAPU'
    });
  });

  client.on('response', (data) => {
    var query = data.query;
    var row = data.row;
    var action;
    if (row) {
      if (data.module == 'viewpreAPU') {
        if (query == 'select' || query == 'insert') {
          tree.doselect(data.row);
        } else if (query == 'update') {
          tree.doselect(data.row);
        } else if (query == 'delete') {
          data.row.description = null;
          data.row.id = null;
          data.row.parent = null;
          tree.doselect(data.row);
        } else {
          console.log('sin procesar viewpreAPU', data);
        }
      } else if (data.module == 'Contractors') {
        action = contractors[`do${query}`];
        if (action) { action(row); }
        else {
          console.log('sin procesar Contractors', data);
        }
      } else if (data.module == 'APU') {
        action = apu[`do${query}`];
        if (action) { action(row); }
        else {
          console.log('sin procesar APU', data);
        }
      } else if (data.module == 'viewAPUSupplies') {
        if (!row.Supplies_id) {
          return;
        }
        action = viewapusupplies[`[apuid="${row.APU_id}"]`][`do${query}`];
        if (action) { action(row); }
        else {
          console.log('sin procesar viewAPUSupplies', data);
        }
      } else {
        console.log('sin procesar row', data);
      }
    } else if (data.module == 'Supplies') {
      if (query == 'search') {
        var opts = d3.select(`#${data.combo}`)
          .selectAll('option').data(data.rows);

        opts.call(setupOptionCombobox);
        opts.enter().append('option').call(setupOptionCombobox);
        opts.exit().remove();
      }
    } else {
      console.log('sin procesar', data);
    }
  });

  window.client = client;
})(io);
