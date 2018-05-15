'use strict';
(() => {
  const defaultRow = {
    description: ''
  };
  const validations = {
    description: { required: true }
  };

  const fields = [
    'description', 'unit', 'qop', 'estimated'
  ];

  const header = ['Descripcion', 'Unidad', 'Rdto', 'Estimado', '-', 'Ir'];
  const actions = [{
    select: 'button.delete',
    setup: (selection => selection
      .text('-')
      .classed('delete', true)
      .on('click', d => {
        client.emit('data', {
          query: 'delete',
          module: 'APU',
          id: d.id,
          idkey: 'id'
        });
      })
  )}, {
    select: 'button.show',
    setup: (selection => selection
      .text('->')
      .classed('show', true)
      .on('click', d => {

      })
    )
  }];

  window.apu = setupTable('APU', header, actions,
    fields, 'id', validations, defaultRow);
})();
