'use strict';
(() => {
  const defaultRow = {
  };
  const validations = {
  };

  const fields = [
    'AAUId', 'ContractorId', 'APUId', 'qop', 'cost', 'duration'
  ];

  const header = ['-', '-', '-', '-', '-', '-', '-'];
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

  window.preapu = setupTable({
    module: 'preAPU',
    header: header, actions: actions,
    fields: fields, idkey: 'id', validations: validations,
    defaultRow: defaultRow, filter: { key: 'table', value: 'preAPU' }
  });
})();
