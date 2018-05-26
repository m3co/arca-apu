'use strict';
(() => {
  const defaultRow = {
  };
  const validations = {
  };

  const fields = [
    'preAPU_qop', 'APU_unit', 'cost', 'duration', {
      name: 'APUId', show: 'APU_description'
    }
  ];

  const header = [
    'Cantidad', 'Unidad', 'Costo', 'Duracion', 'APU', ' '];
  const actions = [{
    select: 'button.delete',
    setup: (selection => selection
      .text('-')
      .classed('delete', true)
      .on('click', d => {
        client.emit('data', {
          query: 'delete',
          module: 'preAPU',
          id: d.id,
          idkey: 'id'
        });
      })
  )}];

  function doselect(row) {
    var storage = doselect.storage;
    var bounceRender = doselect.bounceRender;
    var found = storage.find(d => d['preAPUId'] == row['preAPUId']);
    if (!found) {
      storage.push(row);
      row.supplies = [];
      bounceRender();
    } else {
      found.supplies.push(row);
      bounceRender();
    }
  }

  const fields_supplies = [
    'Supplies_description', 'Supplies_unit', 'Supplies_cost', 'APUSupplies_qop'
  ];
  fields_supplies[Symbol.for('validations')] = {};

  const extrarow = [{
    update: function(d, i, m) {
      console.log(d, i, m, 'update');
    },
    exit: function(d, i, m) {
      console.log(d, i, m, 'exit');
    },
    enter: function(d, i, m) {
      var tb = d3.select(this.parentElement)
        .selectAll(`tr[type="apusupplies"][aauid="${d.AAUId}"]`)
        .data(d.APUId ? [d] : []).enter()
        .select(function() {
          return this.insertBefore(
            document.createElement('tr'), m[i].nextSibling
          );
        })
        .attr('aauid', d.AAUId)
        .attr('type', 'apusupplies')
        .append('td')
          .attr('colspan', 7).append('tr').append('table');
      var th = tb.append('thead').append('tr');
      th.append('th').text('Descripcion');
      th.append('th').text('Unidad');
      th.append('th').text('Costo');
      th.append('th').text('Rdto');

      var tr = tb.append('tbody')
        .selectAll('tr[type="viewpreapusupplies"]')
        .data(d.supplies).enter().append('tr')
          .attr('type', 'viewpreapusupplies');

      setupRedacts('viewpreAPUAPUSupplies', 'id', fields_supplies, tr);
    }
  }, {
    update: function(d, i, m) {
      console.log(d, i, m, 'update');
    },
    exit: function(d, i, m) {
      console.log(d, i, m, 'exit');
    },
    enter: function(d, i, m) {
      var tb = d3.select(this.parentElement)
        .selectAll(`tr[type="apu"][aauid="${d.AAUId}"]`)
        .data(d.APUId ? [d] : []).enter()
        .select(function() {
          return this.insertBefore(
            document.createElement('tr'), m[i].nextSibling
          );
        })
        .attr('aauid', d.AAUId)
        .attr('type', 'apu')
        .append('td')
          .attr('colspan', 7).append('tr').append('table').append('tbody');
      tb.append('td')
        .attr('key', 'APU_description')
        .text(d => d.APU_description);
      tb.append('td')
        .attr('key', 'APU_unit')
        .text(d => d.APU_unit);
      tb.append('td')
        .attr('key', 'APU_information')
        .text(d => d.APU_information);
      // Yo me pregunto aqui como voy a hacer para REUTILIZAR el codigo
      // ya desarrollado en setupTable?
    }
  }];

  window.preapu = setupTable({
    module: 'viewpreAPUAPUSupplies',
    header: header, actions: actions, extraRows: extrarow,
    fields: fields, idkey: 'id', validations: validations,
    defaultRow: defaultRow, doselect: doselect,
    filter: { key: 'table', value: 'viewpreAPUAPUSupplies' }
  });
})();
