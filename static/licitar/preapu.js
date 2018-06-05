'use strict';
(() => {
  const defaultRow = {
  };
  const validations = {
    cost: { required: true },
    duration: { required: true }
  };

  var ContractorId = location.search.match(/\d+$/);
  const fields = [
    'AAU_description', 'AAU_unit', 'preAPU_qop', 'APU_unit', 'cost', 'duration',{
     name: 'APUId',
     show: 'APU_description',
     bike: {
       client: client,
       module: 'APU',
       key: 'description',
       filter: {
         ContractorId: ContractorId ? ContractorId.toString() : 1
       },
       onblur: function(d, input) {
         if (input._found) {
           if (input._found._row) {
             this.textContent = input._found._row.description;
           }
         }
       }
     }
   }
  ];

  const header = [
    'Descripcion', 'Unidad', 'Cantidad', 'Unidad', 'Costo', 'Duracion', 'APU', ' '];
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
      row[Symbol.for('Supplies')] = [];
      bounceRender();
    } else {
      found[Symbol.for('Supplies')].push(row);
      bounceRender();
    }
  }

  const fields_apu = [
    'APU_description', 'APU_unit', 'APU_information', 'APU_qop'
  ]; // Y eso! 'APU_information' debería ir en una nueva linea
  fields_apu[Symbol.for('validations')] = {};

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
          .attr('colspan', 7).append('table');
      var th = tb.append('thead').append('tr');
      th.append('th').text('Descripcion');
      th.append('th').text('Unidad');
      th.append('th').text('Costo');
      th.append('th').text('Rdto');

      var tr = tb.append('tbody')
        .selectAll('tr[type="viewpreapusupplies"]')
        .data(d[Symbol.for('Supplies')]).enter().append('tr')
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
          .attr('colspan', 7).append('table');
      var th = tb.append('thead').append('tr');
      th.append('th').text('Descripcion');
      th.append('th').text('Unidad');
      th.append('th').text('Informacion');
      th.append('th').text('Rdto');
      var tr = tb.append('tbody').append('tr')
        .attr('type', 'apu');
      setupRedacts('viewpreAPUAPUSupplies', 'id', fields_apu, tr);
    }
  }];

  window.preapu = setupTable({
    module: 'viewpreAPUAPUSupplies',
    header: header, actions: actions, extraRows: extrarow,
    fields: fields, idkey: 'id', validations: validations,
    defaultRow: defaultRow, doselect: doselect, preventNewEntry: true,
    filter: { key: 'table', value: 'viewpreAPUAPUSupplies' }
  });
})();
