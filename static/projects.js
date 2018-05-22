'use strict';
(() => {
  const defaultRow = {
    name: ''
  };
  const validations = {
    name: { required: true }
  };

  const fields = [
    'name'
  ];

  const header = ['Proyecto', '-', 'Ir'];
  const actions = [{
    select: 'button.delete',
    setup: (selection => selection
      .text('-')
      .classed('delete', true)
      .on('click', d => {
        client.emit('data', {
          query: 'delete',
          module: 'Projects',
          id: d.id,
          idkey: 'id'
        });
      })
  )}, {
    select: 'button.show',
    setup: (selection => selection
      .text('>')
      .classed('show', true)
      .on('click', d => {
        /*
        window.apu.clear({
          ContractorId: d.id
        });
        document.querySelector('table#APU').style.display = 'table-cell';
        client.emit('data', {
          query: 'select',
          module: 'APU',
          ContractorId: d.id
        });
        */
      })
    )
  }];

  window.projects = setupTable({
    module: 'Projects',
    header: header, actions: actions,
    fields: fields, idkey: 'id', validations: validations,
    defaultRow: defaultRow, filter: { key: 'table', value: 'Projects' }
  });
})();
