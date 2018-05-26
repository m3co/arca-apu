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
    var found = storage.find(d => d['id'] == row['id']);
    if (!found) {
      storage.push(row);
      bounceRender();
    }
  }

  window.preapu = setupTable({
    module: 'preAPU',
    header: header, actions: actions,
    fields: fields, idkey: 'id', validations: validations,
    defaultRow: defaultRow, filter: { key: 'table', value: 'preAPU' },
    doselect: doselect
  });
})();
