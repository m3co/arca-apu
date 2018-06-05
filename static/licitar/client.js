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

    var ContractorId = location.search.match(/\d+$/);
    client.emit('data', {
      query: 'select',
      module: 'viewpreAPUAPUSupplies',
      ContractorId: ContractorId ? ContractorId.toString() : 1
    });

    client.emit('data', {
      query: 'subscribe',
      module: 'viewpreAPUAPUSupplies'
    });

    client.emit('data', {
      query: 'select',
      module: 'Contractors'
    });

    client.emit('data', {
      query: 'subscribe',
      module: 'APU'
    });
  });

  client.on('response', (data) => {
    var query = data.query;
    var row = data.row;
    var action;
    if (row) {
      if (data.module == 'viewpreAPUAPUSupplies') {
        action = preapu[`do${query}`];
        if (action) { action(row); }
        else {
          console.log('sin procesar APU', data);
        }
      } else if (data.module == 'Contractors') {
        window.contractors.doselect(data.row);
      } else {
        console.log('sin procesar row', data);
      }
    } else if (data.module == 'APU') {
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
