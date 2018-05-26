'use strict';
(() => {
  const defaultRow = {
  };
  const validations = {
  };

  const fields = [
    'preAPU_qop', 'APU_unit', 'cost', 'duration', 'APUId', // esto es la preAPU
    'APU_description'
  ];

  const header = [
    'Cantidad', 'Unidad', 'Costo', 'Duracion', 'APUId',
    'Descripcion', ' '];
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
      bounceRender();
    } else {
      console.log('que hacer con esto?', row);
    }
  }

  const extrarow = [{
    update: function(d, i, m) {
      console.log(d, i, m, 'update');
    },
    exit: function(d, i, m) {
      console.log(d, i, m, 'exit');
    },
    enter: function(d, i, m) {
      var tr = d3.select(this.parentElement)
        .selectAll(`tr[aauid="${d.AAUId}"]`)
        .data([d]).enter()
        .select(function() {
          return this.insertBefore(
            document.createElement('tr'), m[i].nextSibling
          );
        })
        .attr('aauid', d.AAUId).append('td')
          .attr('colspan', 6);
      var tr1 = tr.append('tr');
      tr1.append('td').text('ok1');
      tr1.append('td').text('ok2');
      tr1.append('td').text('ok3');
      tr1.append('td').text('ok4');

      var tr1 = tr.append('tr');
      tr1.append('td').text('ok1');
      tr1.append('td').text('ok2');
      tr1.append('td').text('ok3');
      tr1.append('td').text('ok4');
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
