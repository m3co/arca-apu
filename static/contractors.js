'use strict';
(() => {
  const defaultRow = {
    email: '',
    fullname: ''
  };
  const validations = {
    email: { required: true },
    fullname: { required: true }
  };

  const fields = [
    'email', 'fullname'
  ];

  const header = ['Email', 'Nombre completo', '-', 'Ir'];
  const actions = [{
    select: 'button.delete',
    setup: (selection => selection
      .text('-')
      .classed('delete', true)
      .on('click', d => {
        client.emit('data', {
          query: 'delete',
          module: 'Contractors',
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
        window.apu.clear({
          ContractorId: d.id
        });
        document.querySelector('table#APU').style.display = 'table-cell';
        client.emit('data', {
          query: 'select',
          module: 'APU',
          ContractorId: d.id
        });
      })
    )
  }];

  window.contractors = setupTable({
    module: 'Contractors',
    header: header, actions: actions,
    fields: fields, idkey: 'id', validations: validations,
    defaultRow: defaultRow, filter: { key: 'table', value: 'Contractors' }
  });
})();
